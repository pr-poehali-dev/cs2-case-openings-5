import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    '''Создает подключение к базе данных'''
    return psycopg2.connect(
        os.environ['DATABASE_URL'],
        cursor_factory=RealDictCursor
    )

def escape_sql_string(value):
    '''Экранирует строку для Simple Query Protocol'''
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с кейсами, настройками сайта и историей открытий
    GET /api - получить все данные (настройки + кейсы)
    POST /api/cases - создать/обновить кейс
    POST /api/settings - обновить настройки
    POST /api/openings - записать открытие кейса
    GET /api/openings - получить историю открытий
    '''
    method = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    action = query_params.get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            if action == 'getOpenings':
                return get_openings(conn, event)
            elif action == 'getCaseItems':
                return get_case_items(conn, query_params)
            else:
                return get_all_data(conn)
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if action == 'saveCases':
                return save_cases(conn, body)
            elif action == 'saveSettings':
                return save_settings(conn, body)
            elif action == 'recordOpening':
                return record_opening(conn, body)
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()

def get_all_data(conn) -> Dict[str, Any]:
    '''Получить все настройки и кейсы (без items для уменьшения размера)'''
    with conn.cursor() as cur:
        cur.execute('SELECT key, value FROM site_settings')
        settings_rows = cur.fetchall()
        
        settings = {row['key']: row['value'] for row in settings_rows}
        
        for key in ['banners', 'sections', 'navItems', 'styles']:
            if key in settings:
                settings[key] = json.loads(settings[key])
        
        # Загружаем только базовую информацию о кейсах
        cur.execute('SELECT id, name, image, price, promo_ref, created_at, updated_at FROM cases ORDER BY created_at DESC')
        cases = cur.fetchall()
        
        # Переименовываем поле promo_ref в promoRef для JS
        for case in cases:
            if 'promo_ref' in case:
                case['promoRef'] = case.pop('promo_ref')
        
        # Добавляем пустой массив items (будут загружаться отдельно)
        for case in cases:
            case['items'] = []
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'settings': settings, 'cases': cases}, default=str),
        'isBase64Encoded': False
    }

def save_cases(conn, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Сохранить кейсы в БД'''
    cases = body.get('cases', [])
    
    with conn.cursor() as cur:
        for case in cases:
            case_id = escape_sql_string(case['id'])
            name = escape_sql_string(case['name'])
            image = escape_sql_string(case['image'])
            price = str(case['price'])
            promo_ref = escape_sql_string(case.get('promoRef'))
            
            cur.execute(f'''
                INSERT INTO cases (id, name, image, price, promo_ref, updated_at)
                VALUES ({case_id}, {name}, {image}, {price}, {promo_ref}, CURRENT_TIMESTAMP)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    image = EXCLUDED.image,
                    price = EXCLUDED.price,
                    promo_ref = EXCLUDED.promo_ref,
                    updated_at = CURRENT_TIMESTAMP
            ''')
            
            cur.execute(f'SELECT id FROM case_items WHERE case_id = {case_id}')
            existing_items = {row['id'] for row in cur.fetchall()}
            current_items = {item['id'] for item in case.get('items', [])}
            
            for item in case.get('items', []):
                item_id = escape_sql_string(item['id'])
                item_name = escape_sql_string(item['name'])
                item_image = escape_sql_string(item['image'])
                item_price = str(item['price'])
                rarity = escape_sql_string(item['rarity'])
                
                cur.execute(f'''
                    INSERT INTO case_items (id, case_id, name, image, price, rarity)
                    VALUES ({item_id}, {case_id}, {item_name}, {item_image}, {item_price}, {rarity})
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        image = EXCLUDED.image,
                        price = EXCLUDED.price,
                        rarity = EXCLUDED.rarity
                ''')
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def save_settings(conn, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Сохранить настройки сайта'''
    settings = body.get('settings', {})
    
    with conn.cursor() as cur:
        for key, value in settings.items():
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            key_escaped = escape_sql_string(key)
            value_escaped = escape_sql_string(value)
            
            cur.execute(f'''
                INSERT INTO site_settings (key, value, updated_at)
                VALUES ({key_escaped}, {value_escaped}, CURRENT_TIMESTAMP)
                ON CONFLICT (key) DO UPDATE SET
                    value = EXCLUDED.value,
                    updated_at = CURRENT_TIMESTAMP
            ''')
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def record_opening(conn, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Записать открытие кейса'''
    case_id = escape_sql_string(body.get('caseId'))
    item_id = escape_sql_string(body.get('itemId'))
    user_session = escape_sql_string(body.get('userSession', 'anonymous'))
    
    with conn.cursor() as cur:
        cur.execute(f'''
            INSERT INTO case_openings (case_id, item_id, user_session)
            VALUES ({case_id}, {item_id}, {user_session})
        ''')
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def get_case_items(conn, params: Dict[str, Any]) -> Dict[str, Any]:
    '''Получить items конкретного кейса'''
    case_id = params.get('caseId')
    if not case_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'caseId required'}),
            'isBase64Encoded': False
        }
    
    with conn.cursor() as cur:
        case_id_escaped = escape_sql_string(case_id)
        cur.execute(f'SELECT * FROM case_items WHERE case_id = {case_id_escaped}')
        items = cur.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(items, default=str),
        'isBase64Encoded': False
    }

def get_openings(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    '''Получить историю открытий'''
    params = event.get('queryStringParameters', {}) or {}
    limit = int(params.get('limit', 50))
    user_session = params.get('userSession')
    
    with conn.cursor() as cur:
        if user_session:
            user_session_escaped = escape_sql_string(user_session)
            cur.execute(f'''
                SELECT co.*, c.name as case_name, ci.name as item_name, ci.image, ci.price, ci.rarity
                FROM case_openings co
                JOIN cases c ON co.case_id = c.id
                JOIN case_items ci ON co.item_id = ci.id
                WHERE co.user_session = {user_session_escaped}
                ORDER BY co.opened_at DESC
                LIMIT {limit}
            ''')
        else:
            cur.execute(f'''
                SELECT co.*, c.name as case_name, ci.name as item_name, ci.image, ci.price, ci.rarity
                FROM case_openings co
                JOIN cases c ON co.case_id = c.id
                JOIN case_items ci ON co.item_id = ci.id
                ORDER BY co.opened_at DESC
                LIMIT {limit}
            ''')
        
        openings = cur.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(openings, default=str),
        'isBase64Encoded': False
    }