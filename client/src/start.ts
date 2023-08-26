import jsCookie from 'js-cookie';
import handleUrlChange from './utils/functions/handleUrlChange';

sessionStorage.setItem('user_DbId', jsCookie.get('user_DbId')!);
sessionStorage.setItem('user_id', jsCookie.get('user_id')!);

handleUrlChange();
