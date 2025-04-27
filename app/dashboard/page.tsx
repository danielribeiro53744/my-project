"use client"

import  User  from '@/app/user/page'
import  Admin  from '@/app/admin/page'
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // const user = localStorage.getItem('user');
    
 
  // if (user) {
  //   if(JSON.parse(user).role){
  //     return <Admin />
  //   }else{
  //     return <User />
  //   }
  // } else  {
    
  // } 
  return (
    <h1>OLa</h1>
  )
}