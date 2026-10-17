import React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
const StoreContext = createContext(null);
export const fallbackProducts = [
{id:'p1',name:'Studio Wireless Headphones',category:'Electronics',price:4999,discountPrice:3799,rating:4.8,stock:24,sku:'EL-1001',image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',description:'Immersive sound, soft cushions and all-day comfort. Your playlist deserves this upgrade.'},
{id:'p2',name:'Everyday Minimal Sneakers',category:'Fashion',price:3499,discountPrice:2799,rating:4.6,stock:18,sku:'FA-1002',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',description:'A clean, versatile sneaker built for everyday movement and effortless style.'},
{id:'p3',name:'Ceramic Table Lamp',category:'Home & Living',price:2299,discountPrice:null,rating:4.7,stock:12,sku:'HM-1003',image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',description:'Warm ambient lighting with a sculptural ceramic base for a calmer space.'},
{id:'p4',name:'Classic Analog Watch',category:'Accessories',price:5999,discountPrice:4799,rating:4.9,stock:9,sku:'AC-1004',image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',description:'Timeless details, a refined dial and a strap that looks good everywhere.'},
{id:'p5',name:'Daily Carry Backpack',category:'Accessories',price:2899,discountPrice:null,rating:4.5,stock:21,sku:'AC-1005',image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',description:'A practical, lightweight backpack with room for work, travel and daily essentials.'},
{id:'p6',name:'Hydrating Skin Care Set',category:'Beauty',price:1599,discountPrice:1299,rating:4.4,stock:32,sku:'BE-1006',image:'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',description:'A gentle daily routine designed to leave skin feeling refreshed and hydrated.'},
{id:'p7',name:'Portable Bluetooth Speaker',category:'Electronics',price:3199,discountPrice:2499,rating:4.6,stock:15,sku:'EL-1007',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85',description:'Room-filling sound in a compact speaker made for home and weekends away.'},
{id:'p8',name:'Soft Knit Everyday Tee',category:'Fashion',price:999,discountPrice:null,rating:4.3,stock:42,sku:'FA-1008',image:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',description:'An easy wardrobe essential with a soft feel and a relaxed, clean silhouette.'},
{id:'p9',name:'Insulated Travel Bottle',category:'Home & Living',price:899,discountPrice:699,rating:4.5,stock:50,sku:'HM-1009',image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',description:'Keep your favourite drink close with a durable, reusable insulated bottle.'},
{id:'p10',name:'Modern Desk Organizer',category:'Home & Living',price:1299,discountPrice:null,rating:4.2,stock:17,sku:'HM-1010',image:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85',description:'A tidy home for your everyday desk essentials, designed for focused work.'},
{id:'p11',name:'Everyday Crossbody Bag',category:'Fashion',price:2199,discountPrice:1799,rating:4.7,stock:13,sku:'FA-1011',image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',description:'A compact hands-free bag with thoughtful storage and a polished finish.'},
{id:'p12',name:'Wireless Charging Stand',category:'Electronics',price:1899,discountPrice:null,rating:4.4,stock:26,sku:'EL-1012',image:'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=85',description:'Keep your workspace uncluttered with a convenient wireless charging stand.'}
];
export function StoreProvider({children}) {
 const [products,setProducts]=useState(fallbackProducts),[cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('nova_cart')||'[]')),[user,setUser]=useState(()=>JSON.parse(localStorage.getItem('nova_user')||'null')),[notice,setNotice]=useState('');
 useEffect(()=>{localStorage.setItem('nova_cart',JSON.stringify(cart))},[cart]);
 useEffect(()=>{let alive=true;api.get('/products').then(r=>{const list=r.data.products||r.data;if(alive&&Array.isArray(list)&&list.length)setProducts(list.map(p=>({...p,id:p.id||p._id,image:p.image||p.imageUrl||fallbackProducts[0].image,price:Number(p.price),discountPrice:p.discountPrice?Number(p.discountPrice):null,category:p.category?.name||p.category||'General'}))) }).catch(()=>{});return()=>{alive=false}},[]);
 const addToCart=(product)=>{setCart(old=>{const found=old.find(x=>x.id===product.id);if(found){if(found.quantity>=product.stock){setNotice('You have reached the available stock.');return old}return old.map(x=>x.id===product.id?{...x,quantity:x.quantity+1}:x)}if(product.stock<1){setNotice('This product is out of stock.');return old}return [...old,{...product,quantity:1}]});setNotice(`${product.name} added to your cart.`)};
 const updateQty=(id,quantity)=>setCart(old=>quantity<=0?old.filter(x=>x.id!==id):old.map(x=>x.id===id?{...x,quantity:Math.min(quantity,x.stock||99)}:x));
 const removeFromCart=id=>setCart(old=>old.filter(x=>x.id!==id));
 const logout=()=>{localStorage.removeItem('nova_token');localStorage.removeItem('nova_user');setUser(null)};
 const value=useMemo(()=>({products,setProducts,cart,setCart,user,setUser,notice,setNotice,addToCart,updateQty,removeFromCart,logout}),[products,cart,user,notice]);
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export const useStore=()=>useContext(StoreContext);
export const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(n)||0);
