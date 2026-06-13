'use client'

import React from 'react'

export function StudioWelcome() {
  const links = [
    { icon: '🏠', label: 'Home', path: '/studio/structure/pages;home' },
    { icon: '🗂️', label: 'Projects', path: '/studio/structure/pages;projects' },
    { icon: '📰', label: 'News', path: '/studio/structure/pages;news' },
    { icon: '💼', label: 'Jobs', path: '/studio/structure/pages;jobs' },
    { icon: '🌐', label: 'Site Settings', path: '/studio/structure/settings;siteSettings' },
    { icon: '📑', label: 'Transparency', path: '/studio/structure/pages;transparency' },
  ]

  const regions = [
    { color: '#1A6FA0', label: 'Sudan' },
    { color: '#2D8F16', label: 'Yemen' },
    { color: '#EF8800', label: 'Bremen, DE' },
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'linear-gradient(135deg, #f0f7ff 0%, #fcfcfa 100%)',fontFamily:'sans-serif',padding:'2rem'}}>
      <div style={{background:'#1A6FA0',borderRadius:'16px',padding:'24px 32px',marginBottom:'32px',boxShadow:'0 8px 32px rgba(26,111,160,0.2)'}}>
        <div style={{color:'white',fontSize:'48px',fontWeight:'900',letterSpacing:'4px',lineHeight:1}}>GHAR</div>
        <div style={{color:'rgba(255,255,255,0.8)',fontSize:'11px',letterSpacing:'2px',marginTop:'6px',textAlign:'center'}}>FOUNDATION</div>
      </div>
      <h1 style={{color:'#2A2A2A',fontSize:'28px',fontWeight:'700',marginBottom:'8px',textAlign:'center'}}>Welcome to GHAR Studio</h1>
      <p style={{color:'#666',fontSize:'16px',marginBottom:'48px',textAlign:'center',maxWidth:'400px',lineHeight:'1.6'}}>German Humanitarian Relief Organization — Content Management System</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'16px',width:'100%',maxWidth:'640px',marginBottom:'48px'}}>
        {links.map((item) => (
          <a key={item.label} href={item.path} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',padding:'20px 16px',background:'white',borderRadius:'12px',border:'2px solid #e8f0f7',textDecoration:'none',color:'#2A2A2A',fontSize:'13px',fontWeight:'600',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <span style={{fontSize:'28px'}}>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
      <div style={{display:'flex',gap:'32px',padding:'20px 40px',background:'white',borderRadius:'12px',border:'2px solid #e8f0f7',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
        {regions.map((item) => (
          <div key={item.label} style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:item.color}} />
            <span style={{color:'#666',fontSize:'13px',fontWeight:'500'}}>{item.label}</span>
          </div>
        ))}
      </div>
      <p style={{color:'#aaa',fontSize:'12px',marginTop:'32px'}}>GHAR Organization © {new Date().getFullYear()} — ghar-ngo.de</p>
    </div>
  )
}
