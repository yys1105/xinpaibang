/**
 * Created by bd-pc on 2017/6/20 0020.
 */
export const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://' + window.location.host + '/': 'http://192.168.18.239:8082/';
// export const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://' + window.location.host + '/': 'http://bug.xinpaibang.com';

export const DEFAULT_IMG = '/static/images/img_placeholder.jpg'

export const CONVERSATION_ID = 'CONVERSATION_ID'
export const HOT_TOPIC = 'HOT_TOPIC'
