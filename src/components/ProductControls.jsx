import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { extras } from '../data/products.js';
import { money } from '../utils/storage.js';
export function Qty({v,set}) { return <div className="qty"><button onClick={() => set(Math.max(1,v-1))} aria-label="Reducir cantidad"><Icon icon={faMinus}/></button><output>{v}</output><button onClick={() => set(v+1)} aria-label="Aumentar cantidad"><Icon icon={faPlus}/></button></div>; }
export function Extras({a,set}) { return <fieldset><legend>Personaliza tu hamburguesa</legend>{extras.map(extra => <label key={extra.name}><input type="checkbox" checked={a.some(item => item.name === extra.name)} onChange={event => set(event.target.checked ? [...a,extra] : a.filter(item => item.name !== extra.name))}/> {extra.name} (+{money(extra.price)})</label>)}</fieldset>; }
export function Field({label,...props}) { return <label className="field">{label}<input {...props}/></label>; }
