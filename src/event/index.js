import {Event} from './pc';
import {MobileEvent} from './mobile';

export default function event(_this, isMobile) {
  return isMobile ? new MobileEvent(_this) : new Event(_this);
}
