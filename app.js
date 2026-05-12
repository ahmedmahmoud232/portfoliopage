/* =============================================
   Ahmed's UI/UX Portfolio — React Application
   Stack: React 18 (UMD) + Tailwind + CSS Animations
   ============================================= */

const { useState, useEffect, useRef, useCallback } = React;

// ── SVG Icons (inline, no external dep needed) ──
const Icons = {
  cursor: (p) => <svg width={p.s||22} height={p.s||22} viewBox="0 0 24 24" fill={p.fill||"#0f172a"} stroke="#fff" strokeWidth="1"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>,
  download: (p) => <svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  mail: (p) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
  arrowRight: (p) => <svg width={p.s||18} height={p.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  monitor: (p) => <svg width={p.s||28} height={p.s||28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  layout: (p) => <svg width={p.s||28} height={p.s||28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  smartphone: (p) => <svg width={p.s||28} height={p.s||28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  linkedin: (p) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  menu: (p) => <svg width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  x: (p) => <svg width={p.s||24} height={p.s||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: (p) => <svg width={p.s||20} height={p.s||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ── Scroll Reveal Hook ──
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }}, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
const Reveal = ({ children, className = "", delay = 0 }) => {
  const r = useReveal();
  return <div ref={r} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
};

// ═══════════════════════════════════════
// 1. CUSTOM CURSOR
// ═══════════════════════════════════════
const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target;
      setHover(t.tagName==='A'||t.tagName==='BUTTON'||!!t.closest('a,button,[draggable]'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div className="custom-cursor" style={{ transform: `translate(${pos.x}px,${pos.y}px)` }}>
      <div style={{ transform: `scale(${hover?1.25:1}) rotate(-12deg)`, transition:'transform .15s' }}>
        <Icons.cursor fill={hover?"#3b82f6":"#0f172a"} s={24}/>
      </div>
      <div className="cursor-label">Ahmed</div>
    </div>
  );
};

// ═══════════════════════════════════════
// 2. NAVBAR
// ═══════════════════════════════════════
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = ['Home','About','Projects','Services','Contact'];
  return (
    <nav className="fixed w-full top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-black">A</span>
          Ahmed<span className="text-accent">.</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          {links.map(l=><a key={l} href={`#${l.toLowerCase()}`} className="hover:text-primary transition-colors">{l}</a>)}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-semibold hover:text-accent transition-colors px-4 py-2"><Icons.download s={15}/> Open CV</button>
          <a href="#contact" className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-all shadow-lg shadow-primary/10">Contact Us</a>
        </div>
        <button className="md:hidden" onClick={()=>setOpen(!open)}>{open?<Icons.x/>:<Icons.menu/>}</button>
      </div>
      {open && <div className="md:hidden px-6 pb-6 space-y-3">{links.map(l=><a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)} className="block text-sm font-medium py-2 text-muted hover:text-primary">{l}</a>)}<a href="#contact" className="block text-center bg-primary text-white py-3 rounded-full text-sm font-semibold mt-2">Contact Us</a></div>}
    </nav>
  );
};

// ═══════════════════════════════════════
// 3. HERO — Typewriter Effect
// ═══════════════════════════════════════
const Hero = () => {
  const phrases = ["Turn your idea into a digital product","Crafting User-Centric Designs","Solving Complex Problems"];
  const subs = ["Designing interfaces that are aesthetic, intuitive, and conversion-focused.","Creating experiences that users love and businesses benefit from.","Through research, wireframing, and pixel-perfect UI execution."];
  const [pi, setPi] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const p = phrases[pi];
    const t = setTimeout(() => {
      if (!del && txt === p) setTimeout(()=>setDel(true), 1800);
      else if (del && txt === "") { setDel(false); setPi(i=>(i+1)%phrases.length); }
      else setTxt(p.substring(0, txt.length + (del ? -1 : 1)));
    }, del ? 25 : 55);
    return () => clearTimeout(t);
  }, [txt, del, pi]);

  return (
    <section id="home" className="relative pt-36 pb-24 md:pt-52 md:pb-36 px-6">
      <div className="absolute inset-0 bg-grid z-0"/>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Reveal>
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-accent text-sm font-semibold mb-8 border border-blue-100">👋 Hello, I'm Ahmed — UI/UX Designer</span>
        </Reveal>
        <div className="min-h-[120px] md:min-h-[160px] flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">{txt}<span className="tw-cursor"/></h1>
          <p className="text-base md:text-lg text-muted max-w-xl mx-auto leading-relaxed" style={{opacity:txt.length>5?1:0.3,transition:'opacity .5s'}}>{subs[pi]}</p>
        </div>
        <Reveal delay={200}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-primary/15 text-sm"><Icons.download s={16}/> Open CV</button>
            <a href="#contact" className="w-full sm:w-auto bg-white border-2 border-gray-200 text-primary px-8 py-4 rounded-full font-semibold hover:scale-105 hover:border-gray-300 transition-all text-sm text-center">Contact Us</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════
// 4. TOOLS MARQUEE
// ═══════════════════════════════════════
const ToolsMarquee = () => {
  const tools = [
    {n:"Figma",c:"#a259ff"},{n:"Canva",c:"#00c4cc"},{n:"Miro",c:"#ffd02f"},
    {n:"Forms",c:"#673ab7"},{n:"Webflow",c:"#4353ff"},{n:"Framer",c:"#05f"}
  ];
  const all = [...tools,...tools,...tools,...tools];
  return (
    <div className="marquee-wrap border-y border-gray-100 py-10 bg-white overflow-hidden">
      <div className="marquee-track">
        {all.map((t,i)=>(
          <div key={i} className="tool-item">
            <div className="tool-icon" style={{background:t.c+'18',color:t.c}}>{t.n[0]}</div>
            {t.n}
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// 5. ABOUT + DRAG & DROP SKILLS GAME
// ═══════════════════════════════════════
const SkillsGame = () => {
  const allSkills = [
    {id:'s1',name:'UX Research',cls:'bg-violet-100 text-violet-700'},
    {id:'s2',name:'User Experience',cls:'bg-blue-100 text-blue-700'},
    {id:'s3',name:'UI Design',cls:'bg-pink-100 text-pink-700'},
  ];
  const [slots, setSlots] = useState({a:null,b:null,c:null});
  const [pool, setPool] = useState(allSkills);
  const [overSlot, setOverSlot] = useState(null);

  const drop = (slotKey, e) => {
    e.preventDefault(); setOverSlot(null);
    if (slots[slotKey]) return;
    const id = e.dataTransfer.getData('id');
    const sk = pool.find(s=>s.id===id);
    if (!sk) return;
    const ns = {...slots,[slotKey]:sk};
    setSlots(ns);
    setPool(p=>p.filter(s=>s.id!==id));
    if (ns.a && ns.b && ns.c) setTimeout(()=>window.confetti({particleCount:180,spread:90,origin:{y:0.6},colors:['#3b82f6','#8b5cf6','#ec4899','#f59e0b']}),350);
  };

  const slotDefs = [{k:'a',l:'Research Phase'},{k:'b',l:'Logic & Flow'},{k:'c',l:'Visual Interface'}];

  return (
    <section id="about" className="py-24 bg-bgGray px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <span className="text-accent font-semibold tracking-widest text-xs uppercase mb-3 block">About Me</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">Designing for<br/>real people.</h2>
          <p className="text-muted leading-relaxed text-base mb-8">UI/UX Designer with <strong className="text-primary font-bold">1.5+ years of experience</strong>. I collaborate with teams on PaaS and SaaS products remotely and physically via various platforms to deliver exceptional digital experiences.</p>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-semibold">15+ Projects</span>
            <span className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-semibold">Global Clients</span>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100">
            <h3 className="font-bold text-lg mb-1">My Skillset</h3>
            <p className="text-xs text-muted mb-6">Drag skills from the toolbox into the slots!</p>
            <div className="space-y-3 mb-8">
              {slotDefs.map(s=>(
                <div key={s.k} className="flex items-center gap-3">
                  <div className="w-28 text-xs text-right text-gray-400 font-semibold">{s.l}</div>
                  <div className={`drop-zone flex-1 ${overSlot===s.k?'over':''} ${slots[s.k]?'filled':''}`}
                    onDragOver={e=>{e.preventDefault();setOverSlot(s.k)}}
                    onDragLeave={()=>setOverSlot(null)}
                    onDrop={e=>drop(s.k,e)}>
                    {slots[s.k] ? (
                      <div className={`w-full h-12 rounded-xl flex items-center gap-2 px-4 font-semibold text-sm ${slots[s.k].cls}`}><Icons.check s={16}/>{slots[s.k].name}</div>
                    ) : <span className="text-gray-300 text-xs">Drop here</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center min-h-[80px]">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[.2em] block mb-3">Toolbox</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {pool.map(sk=>(
                  <div key={sk.id} draggable onDragStart={e=>e.dataTransfer.setData('id',sk.id)} className={`skill-chip ${sk.cls}`}>{sk.name}</div>
                ))}
                {pool.length===0 && <span className="text-green-600 font-bold text-sm">✅ Profile Complete!</span>}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════
// 6. PROJECTS SHOWCASE
// ═══════════════════════════════════════
const Projects = () => {
  const works = [
    {title:"Fintech Dashboard",desc:"A comprehensive SaaS dashboard for managing corporate expenses with complex data visualization and real-time analytics.",bg:"bg-blue-50"},
    {title:"E-Commerce Mobile App",desc:"A sleek, conversion-optimized shopping experience crafted for modern audiences with seamless checkout flows.",bg:"bg-violet-50"},
  ];
  return (
    <section id="projects" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal><div className="text-center mb-16"><h2 className="text-3xl md:text-4xl font-extrabold mb-3">Selected Works</h2><p className="text-muted">A glimpse into recent design solutions.</p></div></Reveal>
        <div className="space-y-10">
          {works.map((w,i)=>(
            <Reveal key={i} delay={i*120}>
              <div className={`project-card flex flex-col ${i%2?'md:flex-row-reverse':'md:flex-row'} rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50`}>
                <div className={`w-full md:w-3/5 min-h-[280px] md:min-h-[380px] ${w.bg} flex items-center justify-center p-8 relative`}>
                  <div className="project-mockup w-full max-w-xs bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200/40 flex flex-col">
                    <div className="h-7 border-b border-gray-100 flex items-center px-3 gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-400"/><div className="w-2.5 h-2.5 rounded-full bg-green-400"/>
                    </div>
                    <div className="p-4 space-y-3 flex-1">
                      <div className="h-10 bg-gray-100 rounded-lg w-full"/><div className="flex gap-2"><div className="h-16 bg-gray-100 rounded-lg w-1/3"/><div className="h-16 bg-gray-100 rounded-lg w-2/3"/></div><div className="h-8 bg-gray-50 rounded-lg w-2/3"/>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-xs font-bold text-accent tracking-widest uppercase mb-3">Case Study 0{i+1}</span>
                  <h3 className="text-2xl font-bold mb-4">{w.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-8">{w.desc}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-primary text-white py-3 px-6 rounded-full text-sm font-semibold hover:bg-black transition-colors flex-1 text-center">View Project</button>
                    <button className="bg-gray-50 border border-gray-200 py-3 px-6 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors flex-1 text-center">I want one like this</button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════
// 7. SERVICES
// ═══════════════════════════════════════
const Services = () => {
  const items = [
    {title:"Web Design",icon:<Icons.monitor s={28}/>,desc:"Responsive, engaging interfaces that elevate your digital presence and brand identity."},
    {title:"Landing Pages",icon:<Icons.layout s={28}/>,desc:"High-converting page structures specifically designed for marketing campaigns."},
    {title:"Mobile Apps",icon:<Icons.smartphone s={28}/>,desc:"Intuitive iOS and Android app experiences designed for engagement and retention."},
  ];
  return (
    <section id="services" className="py-24 px-6 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <Reveal><span className="text-accent font-semibold tracking-widest text-xs uppercase mb-3 block">What I Do</span><h2 className="text-3xl md:text-4xl font-extrabold mb-12">Services</h2></Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((s,i)=>(
            <Reveal key={i} delay={i*100}>
              <div className="service-card">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6">{s.icon}</div>
                <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════
// 8. CONTACT
// ═══════════════════════════════════════
const Contact = () => (
  <section id="contact" className="py-24 px-6 bg-bgGray">
    <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12">
      <Reveal className="md:col-span-2 space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold">Let's Talk!</h2>
        <p className="text-muted text-sm">Have a project in mind? Let's discuss it.</p>
        <div className="space-y-3 pt-4">
          <a href="mailto:ahmed@example.com" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-accent transition-colors group">
            <div className="bg-blue-50 text-accent p-3 rounded-xl group-hover:scale-110 transition-transform"><Icons.mail/></div>
            <div><div className="text-[10px] text-gray-400 font-semibold uppercase">Email</div><div className="font-semibold text-sm">ahmed@example.com</div></div>
          </a>
          <a href="#" className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-accent transition-colors group">
            <div className="bg-blue-50 text-accent p-3 rounded-xl group-hover:scale-110 transition-transform"><Icons.linkedin/></div>
            <div><div className="text-[10px] text-gray-400 font-semibold uppercase">Connect</div><div className="font-semibold text-sm">LinkedIn Profile</div></div>
          </a>
        </div>
      </Reveal>
      <Reveal delay={150} className="md:col-span-3">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div><label className="text-xs font-bold text-primary block mb-2">Name</label><input type="text" placeholder="John Doe" className="form-input"/></div>
            <div><label className="text-xs font-bold text-primary block mb-2">Email</label><input type="email" placeholder="john@company.com" className="form-input"/></div>
          </div>
          <div className="mb-5"><label className="text-xs font-bold text-primary block mb-2">Inquiry</label><textarea rows="4" placeholder="Tell me about your project..." className="form-input resize-none"/></div>
          <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 text-sm">Send Message <Icons.arrowRight/></button>
        </div>
      </Reveal>
    </div>
  </section>
);

// ═══════════════════════════════════════
// 9. FOOTER
// ═══════════════════════════════════════
const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-20 pb-8 px-6">
    <div className="max-w-6xl mx-auto text-center">
      <Reveal>
        <h2 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase mb-10 leading-none">We Are Not<br/>The Users.</h2>
      </Reveal>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
        <button className="bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold hover:scale-105 transition-transform flex items-center gap-2 justify-center"><Icons.download s={15}/> Open CV</button>
        <a href="#contact" className="bg-gray-100 text-primary px-8 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors text-center">Contact Us</a>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-100 gap-4 text-sm text-muted">
        <span>© 2026 Ahmed. All rights reserved.</span>
        <div className="flex gap-6 font-medium"><a href="#" className="hover:text-primary transition-colors">Twitter</a><a href="#" className="hover:text-primary transition-colors">LinkedIn</a><a href="#" className="hover:text-primary transition-colors">Dribbble</a></div>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════
const App = () => (
  <div className="relative selection:bg-accent/20">
    <CustomCursor/>
    <Navbar/>
    <Hero/>
    <ToolsMarquee/>
    <SkillsGame/>
    <Projects/>
    <Services/>
    <Contact/>
    <Footer/>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
