import { useEffect, useState } from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { getHashRoute, navigateTo, productSlug } from './router.js';
import { products } from './data/products.js';
import { load } from './utils/storage.js';
import { Header, Footer } from './components/Layout.jsx';
import { Cart, Info, Login, Checkout, Confirm } from './components/Overlays.jsx';
import { Home, Menu, Detail, Contact, Track, Auth, NotFound } from './pages/index.jsx';

export default function App() {
  const [route, setRoute] = useState(getHashRoute), [dark, setDark] = useState(() => localStorage.getItem('burgerhausTheme') === 'dark'), [cart, setCart] = useState(() => load('burgerhausCart', [])), [mobile, setMobile] = useState(false), [drawer, setDrawer] = useState(false), [modal, setModal] = useState(null), [selected, setSelected] = useState(null), [toast, setToast] = useState(null), [filter, setFilter] = useState('all'), [user, setUser] = useState(() => load('burgerhausUser', null));
  useEffect(() => { const update = () => setRoute(getHashRoute()); addEventListener('hashchange', update); return () => removeEventListener('hashchange', update); }, []);
  useEffect(() => { localStorage.setItem('burgerhausTheme', dark ? 'dark' : 'light'); document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => localStorage.setItem('burgerhausCart', JSON.stringify(cart)), [cart]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); }, [toast]);
  const nav = path => { navigateTo(path); setMobile(false); scrollTo({ top: 0, behavior: 'smooth' }); };
  const notice = (message, error = false) => setToast({ message, error });
  const add = (product, quantity = 1, extras = []) => { const key = `${product.name}|${extras.map(extra => extra.name).join('|')}`, price = product.price + extras.reduce((sum, extra) => sum + extra.price, 0); setCart(current => current.some(item => item.key === key) ? current.map(item => item.key === key ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { key, name: product.name, price, quantity, adds: extras }]); notice(`${product.name} se añadió al carrito.`); };
  const login = form => { const data = new FormData(form), nextUser = { name: data.get('name') || data.get('email').split('@')[0], email: data.get('email') }; localStorage.setItem('burgerhausUser', JSON.stringify(nextUser)); setUser(nextUser); notice('Sesión de demostración iniciada.'); };
  const items = cart.reduce((sum, item) => sum + item.quantity, 0), sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0), product = route.match(/^\/producto\//) && products.find(item => productSlug(item.name) === route.split('/').pop()), category = route.match(/^\/menu\/(hamburguesa|combos|bebidas|cafe|acompanamientos)$/)?.[1], productActions = { add, info: item => { setSelected(item); setModal('info'); } };
  const page = route === '/' ? <Home {...productActions} {...{ filter, setFilter, nav }} /> : category ? <Menu {...productActions} cat={category} /> : product ? <Detail p={product} add={add} /> : route === '/contacto' ? <Contact notice={notice} /> : route === '/rastreo' ? <Track /> : route === '/login' ? <Auth {...{ nav, login }} /> : <NotFound nav={nav} />;
  return <div className="app"><Header {...{ nav, dark, setDark, mobile, setMobile, items, setDrawer, setModal, user }} />{page}<Footer nav={nav} /><div className="sr" aria-live="polite">{toast?.message}</div>{toast && <div className={`toast ${toast.error ? 'error' : ''}`}><Icon icon={toast.error ? faCircleInfo : faCheck} /> {toast.message}</div>}{drawer && <Cart {...{ cart, setCart, sub, setDrawer, setModal, notice }} />}{modal === 'info' && <Info p={selected} add={add} close={() => setModal(null)} />}{modal === 'login' && <Login close={() => setModal(null)} {...{ nav, login }} />}{modal === 'checkout' && <Checkout close={() => setModal(null)} submit={event => { event.preventDefault(); if (!cart.length) return notice('El carrito está vacío.', true); setCart([]); setDrawer(false); setModal('confirm'); }} />}{modal === 'confirm' && <Confirm close={() => setModal(null)} nav={nav} />}</div>;
}
