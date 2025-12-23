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
    path = event.get('pathParams', {}).get('proxy', '')
    
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
            if 'openings' in path:
                return get_openings(conn, event)
            else:
                return get_all_data(conn)
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if 'cases' in path:
                return save_cases(conn, body)
            elif 'settings' in path:
                return save_settings(conn, body)
            elif 'openings' in path:
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
    '''Получить все настройки и кейсы'''
    with conn.cursor() as cur:
        cur.execute('SELECT key, value FROM site_settings')
        settings_rows = cur.fetchall()
        
        settings = {row['key']: row['value'] for row in settings_rows}
        
        for key in ['banners', 'sections', 'navItems', 'styles']:
            if key in settings:
                settings[key] = json.loads(settings[key])
        
        cur.execute('SELECT * FROM cases ORDER BY created_at DESC')
        cases = cur.fetchall()
        
        for case in cases:
            cur.execute('SELECT * FROM case_items WHERE case_id = %s', (case['id'],))
            case['items'] = cur.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'settings': settings, 'cases': cases}),
        'isBase64Encoded': False
    }

def save_cases(conn, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Сохранить кейсы в БД'''
    cases = body.get('cases', [])
    
    with conn.cursor() as cur:
        for case in cases:
            cur.execute('''
                INSERT INTO cases (id, name, image, price, updated_at)
                VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    image = EXCLUDED.image,
                    price = EXCLUDED.price,
                    updated_at = CURRENT_TIMESTAMP
            ''', (case['id'], case['name'], case['image'], case['price']))
            
            cur.execute('SELECT id FROM case_items WHERE case_id = %s', (case['id'],))
            existing_items = {row['id'] for row in cur.fetchall()}
            current_items = {item['id'] for item in case.get('items', [])}
            
            for item in case.get('items', []):
                cur.execute('''
                    INSERT INTO case_items (id, case_id, name, image, price, rarity)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        image = EXCLUDED.image,
                        price = EXCLUDED.price,
                        rarity = EXCLUDED.rarity
                ''', (item['id'], case['id'], item['name'], item['image'], item['price'], item['rarity']))
    
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
            
            cur.execute('''
                INSERT INTO site_settings (key, value, updated_at)
                VALUES (%s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (key) DO UPDATE SET
                    value = EXCLUDED.value,
                    updated_at = CURRENT_TIMESTAMP
            ''', (key, value))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def record_opening(conn, body: Dict[str, Any]) -> Dict[str, Any]:
    '''Записать открытие кейса'''
    case_id = body.get('caseId')
    item_id = body.get('itemId')
    user_session = body.get('userSession', 'anonymous')
    
    with conn.cursor() as cur:
        cur.execute('''
            INSERT INTO case_openings (case_id, item_id, user_session)
            VALUES (%s, %s, %s)
        ''', (case_id, item_id, user_session))
    
    conn.commit()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }

def get_openings(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    '''Получить историю открытий'''
    params = event.get('queryStringParameters', {})
    limit = int(params.get('limit', 50))
    user_session = params.get('userSession')
    
    with conn.cursor() as cur:
        if user_session:
            cur.execute('''
                SELECT co.*, c.name as case_name, ci.name as item_name, ci.image, ci.price, ci.rarity
                FROM case_openings co
                JOIN cases c ON co.case_id = c.id
                JOIN case_items ci ON co.item_id = ci.id
                WHERE co.user_session = %s
                ORDER BY co.opened_at DESC
                LIMIT %s
            ''', (user_session, limit))
        else:
            cur.execute('''
                SELECT co.*, c.name as case_name, ci.name as item_name, ci.image, ci.price, ci.rarity
                FROM case_openings co
                JOIN cases c ON co.case_id = c.id
                JOIN case_items ci ON co.item_id = ci.id
                ORDER BY co.opened_at DESC
                LIMIT %s
            ''', (limit,))
        
        openings = cur.fetchall()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(openings, default=str),
        'isBase64Encoded': False
    }