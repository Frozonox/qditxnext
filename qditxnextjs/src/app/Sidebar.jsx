'use client'
import './globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import Link from 'next/link';
import { useState } from 'react';

function Sidebar() {
//Rutas del menú
    const sidebarItems = [
        {
            name: "Home",
            href: "/dashboard",
            icon: <i className="bi bi-house"></i>
        },
        {
            name: "Administradores",
            href: "/administradores",
            icon: <i className="bi bi-person-badge-fill"></i>
        },
        {
            name: "Oportunidades",
            href: "/oportunities",
            icon: <i className="bi bi-briefcase"></i>
        },
        {
            name: "Organizaciónes",
            href: "/organizaciones",
            icon: <i className="bi bi-building"></i>
        },
        {
            name:"Postulantes",
            href:"/postulantes",
            icon: <i className="bi bi-people-fill"></i>
        },
        {
            name:"Practicas",
            href:"/practicas",
            icon: <i className="bi bi-clipboard-check"></i>
        },
        {
            name:"legalizaciones",
            href:"/legalizaciones",
            icon:<i className="bi bi-pencil"></i>
        }
    ]

    const [isCollapsed, SetIsCollapsedSidebar] = useState(false);

    const ToggleSidebarCollapseHandler =()=>
    {
        SetIsCollapsedSidebar((prev) => !prev);
    }

  return (
    <div className='sidebar__wrapper'>
        <button className='btn222' onClick={ToggleSidebarCollapseHandler}>
        <i className="bi bi-caret-left-fill"></i>
        </button>
        <aside className='sidebar' data-collapse={isCollapsed}>
            <div className='sidebar__top'>
                <img               
                src="./next.svg"
                // width={80}
                // height={80}
                className='sidebar__logo'
                alt="logo"
                />
                <p className='sidebar_logo_name'>Progresa</p>
            </div>
        <ul className='sidebar__list'>

          {sidebarItems.map(({name, href, icon: icon}, index) => (  
          <li key={index} className='sidebar__item'>
            <Link href={href} className='sidebar__link'>
                    <span className='siderbar__icon'>
                    {icon}
                    </span>
                    <span className='sidebar__name'>{name}</span>
            </Link>

            </li>))}

        </ul>

        </aside>
    </div>
       
  )
}

export default Sidebar