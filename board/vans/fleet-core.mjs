// Shared rules for the Vehicles tab at /board/vans/
// Used by the page itself and by the Netlify functions fleet.mjs and fleet-reminders.mjs,
// so the board and the reminder emails always agree on what is due.

export const BOARD_URL = 'https://duncansdogco.com/board/vans/';

// Every vehicle gets these. Staff type the date it was last done; the due date follows.
export const CHECKS = [
  { key:'mot',       label:'MOT',                   emo:'🛠️', every:12, minusDay:true, ask:'Date of the last MOT pass',        todo:'Book the MOT. It can be done up to a month early and keeps the same renewal date.' },
  { key:'service',   label:'Service',               emo:'🔧', every:12, everyMiles:10000, ask:'Date of the last service',       todo:'Book a service with the garage.' },
  { key:'tax',       label:'Road tax',              emo:'💷', every:12, ask:'Date the tax was last paid',                     todo:'Renew the tax at gov.uk/vehicle-tax. You need the V5C or the reminder letter.' },
  { key:'insurance', label:'Insurance',             emo:'🛡️', every:12, ask:'Date the cover last renewed',                    todo:'Check the renewal with the insurer before it lapses.' },
  { key:'breakdown', label:'Breakdown cover',       emo:'🚨', every:12, ask:'Date the cover last renewed',                    todo:'Renew the breakdown cover.' },
  { key:'safety',    label:'Tyres, lights and oil', emo:'🛞', every:1,  ask:'Date of the last check',                         todo:'Check tyre tread and pressure, lights, oil, screen wash and the air flow in the back for the dogs.' },
];
export const DRIVER_CHECK = { key:'licence', label:'Licence check', emo:'🪪', every:6, ask:'Date you last checked their licence', todo:'Check their licence at gov.uk/view-driving-licence. The driver gets a check code from the same page.' };
export const EVERY_OPTIONS = [1,3,6,12,24];

export const emptyFleet = () => ({ v:1, vehicles:[], drivers:[], updatedAt:null });

/* ---------- dates (plain YYYY-MM-DD strings, no time zones) ---------- */
export function parseISO(s){ const [y,m,d]=s.split('-').map(Number); return new Date(Date.UTC(y,m-1,d)); }
export function toISO(d){ return d.toISOString().slice(0,10); }
export function addDays(s,n){ const d=parseISO(s); d.setUTCDate(d.getUTCDate()+n); return toISO(d); }
export function addMonths(s,n){
  const [y,m,d]=s.split('-').map(Number);
  const t=new Date(Date.UTC(y,m-1+n,1));
  const last=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth()+1,0)).getUTCDate();
  t.setUTCDate(Math.min(d,last)); return toISO(t);
}
export function daysBetween(a,b){ return Math.round((parseISO(b)-parseISO(a))/86400000); }
export function ukToday(now=new Date()){ return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(now); }
export function fmtDate(s){ return parseISO(s).toLocaleDateString('en-GB',{timeZone:'UTC',weekday:'short',day:'numeric',month:'short',year:'numeric'}); }
export function everyText(n){ return n===1?'every month':n===12?'every year':n===24?'every 2 years':`every ${n} months`; }
export function whenText(daysLeft){
  if(daysLeft<0) return `${-daysLeft} day${daysLeft===-1?'':'s'} overdue`;
  if(daysLeft===0) return 'due today';
  if(daysLeft===1) return 'due tomorrow';
  return `due in ${daysLeft} days`;
}

/* ---------- mileage ---------- */
function readings(v){
  const out=(v.mileage||[]).filter(e=>e && e.date && Number.isFinite(+e.miles)).map(e=>({date:e.date,miles:+e.miles}));
  const s=v.checks?.service;
  if(s?.last && s.lastMiles!=null && s.lastMiles!=='') out.push({date:s.last,miles:+s.lastMiles});
  return out.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.miles-b.miles);
}
export function latestMileage(v){ const r=readings(v); return r.length?r[r.length-1]:null; }
export function milesPerDay(v){
  const r=readings(v); if(r.length<2) return null;
  const last=r[r.length-1]; const from=addDays(last.date,-180);
  const first=r.find(e=>e.date>=from && e.date<last.date); if(!first) return null;
  const days=daysBetween(first.date,last.date), miles=last.miles-first.miles;
  return days>=7 && miles>0 ? miles/days : null;
}

/* ---------- what is due ---------- */
export function stagesFor(every){ return every>=6?[30,14,7,1,0]:every>=3?[14,7,1,0]:[3,0]; }

export function dueFor(def, st, vehicle, today){
  st=st||{};
  if(st.off) return { status:'off' };
  if(!st.last) return { status:'unset' };
  const every=+st.every||def.every;
  let due=addMonths(st.last,every); if(def.minusDay) due=addDays(due,-1);
  let milesLeft=null, byMiles=false;
  const everyMiles=def.everyMiles ? (+st.everyMiles||def.everyMiles) : null;
  if(everyMiles && vehicle && st.lastMiles!=null && st.lastMiles!==''){
    const cur=latestMileage(vehicle);
    if(cur && cur.miles>=+st.lastMiles){
      milesLeft=+st.lastMiles+everyMiles-cur.miles;
      const mpd=milesPerDay(vehicle);
      const byM = milesLeft<=0 ? cur.date : mpd ? addDays(cur.date,Math.floor(milesLeft/mpd)) : null;
      if(byM && byM<due){ due=byM; byMiles=true; }
    }
  }
  const daysLeft=daysBetween(today,due);
  const status=daysLeft<0?'overdue':daysLeft<=stagesFor(every)[0]?'soon':'ok';
  return { status, due, daysLeft, every, milesLeft, everyMiles, byMiles };
}

export function vehicleName(v){ return [v.name, v.reg].filter(Boolean).join(' · ') || 'Vehicle'; }

// Every check on every vehicle and driver, with its due date worked out.
export function allItems(fleet, today){
  const out=[];
  for(const v of fleet.vehicles||[]){
    for(const def of CHECKS) out.push({ owner:v.id, who:vehicleName(v), def, info:dueFor(def, v.checks?.[def.key], v, today) });
    for(const c of v.custom||[]){
      const def={ key:'c-'+c.id, label:c.label||'Check', emo:'📌', every:+c.every||12, todo:'' };
      out.push({ owner:v.id, who:vehicleName(v), def, info:dueFor(def, c, null, today) });
    }
  }
  for(const d of fleet.drivers||[]) out.push({ owner:d.id, who:d.name||'Driver', def:DRIVER_CHECK, info:dueFor(DRIVER_CHECK, d.licence, null, today) });
  return out;
}

/* ---------- which reminders go out today ----------
   Annual checks: 30, 14, 7 and 1 day before, on the day, then weekly while overdue.
   A new date on the board changes the due date, so the reminders stop by themselves. */
export function pickReminders(fleet, sent, today){
  sent=sent||{}; const prev=sent.items||{};
  const items={}, due=[], upcoming=[];
  for(const it of allItems(fleet,today)){
    const i=it.info; if(i.status==='off'||i.status==='unset') continue;
    const key=`${it.owner}:${it.def.key}:${i.due}`;
    const rec={...(prev[key]||{})};
    let send=false;
    if(i.daysLeft<0){ if(!rec.overdue || daysBetween(rec.overdue,today)>=7){ rec.overdue=today; send=true; } }
    else {
      const hit=stagesFor(i.every).filter(s=>i.daysLeft<=s);
      if(hit.length){ const stage=Math.min(...hit); if(rec.stage==null || rec.stage>stage){ rec.stage=stage; send=true; } }
    }
    if(send) due.push(it); else if(i.daysLeft<=60) upcoming.push(it);
    if(rec.stage!=null || rec.overdue) items[key]=rec;
  }
  // Mondays: a nudge for any vehicle with no mileage logged in two weeks
  const nudges=[]; const mileage={...(sent.mileage||{})};
  if(parseISO(today).getUTCDay()===1){
    for(const v of fleet.vehicles||[]){
      const last=latestMileage(v);
      if((!last || daysBetween(last.date,today)>=14) && mileage[v.id]!==today){ nudges.push({ who:vehicleName(v), last }); mileage[v.id]=today; }
    }
  }
  const byDays=(a,b)=>a.info.daysLeft-b.info.daysLeft;
  return { due:due.sort(byDays), upcoming:upcoming.sort(byDays), nudges, sent:{ items, mileage } };
}

/* ---------- the email to info@ ---------- */
const escH=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function rowHTML(it, big){
  const i=it.info; const late=i.daysLeft<0, now=i.daysLeft<=7;
  const colour=late?'#991b1b':now?'#7a4c0c':'#1f4a27', bg=late?'#fef2f2':now?'#fdf0d8':'#e4efe5';
  const miles=i.milesLeft!=null ? ` · ${i.milesLeft<=0?`${(-i.milesLeft).toLocaleString('en-GB')} miles over`:`${i.milesLeft.toLocaleString('en-GB')} miles to go`}` : '';
  return `<tr><td style="padding:${big?'14px':'9px'} 0;border-bottom:1px solid #f3f4f6;vertical-align:top;">
    <p style="margin:0;font-size:${big?'16px':'14px'};font-weight:700;color:#111;">${it.def.emo} ${escH(it.def.label)} <span style="font-weight:400;color:#666;">· ${escH(it.who)}</span></p>
    <p style="margin:4px 0 0;font-size:13px;color:#444;">${fmtDate(i.due)}${miles}</p>
    ${big && it.def.todo ? `<p style="margin:6px 0 0;font-size:13px;color:#444;line-height:1.5;">${escH(it.def.todo)}</p>` : ''}
  </td><td align="right" style="padding:${big?'14px':'9px'} 0 0 12px;border-bottom:1px solid #f3f4f6;vertical-align:top;white-space:nowrap;">
    <span style="display:inline-block;background:${bg};color:${colour};font-size:12px;font-weight:700;padding:5px 10px;border-radius:20px;">${whenText(i.daysLeft)}</span>
  </td></tr>`;
}

export function buildEmail({ due, upcoming, nudges, today, test }){
  const n=due.length;
  let subject;
  if(test) subject='Test: vehicle reminders from the team board';
  else if(n===1) subject=`${due[0].def.label} ${whenText(due[0].info.daysLeft)}: ${due[0].who}`;
  else if(n>1) subject=`${n} vehicle reminders: ${[...new Set(due.map(d=>d.def.label))].slice(0,3).join(', ')}`;
  else subject='Mileage to log on the vehicles board';

  const section=(title, rows, big)=>rows.length?`<tr><td style="padding:22px 28px 0;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#9ca3af;">${title}</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">${rows.map(r=>rowHTML(r,big)).join('')}</table>
    </td></tr>`:'';

  const nudgeHTML=nudges.length?`<tr><td style="padding:22px 28px 0;">
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#9ca3af;">Mileage not logged for two weeks</p>
      ${nudges.map(x=>`<p style="margin:0 0 6px;font-size:14px;color:#111;">🚐 ${escH(x.who)} <span style="color:#666;">· ${x.last?`last logged ${fmtDate(x.last.date)}`:'never logged'}</span></p>`).join('')}
      <p style="margin:6px 0 0;font-size:13px;color:#444;">Read the number off the dashboard and add it on the board. It keeps the service date right.</p>
    </td></tr>`:'';

  const intro=test
    ? 'This is a test from the vehicles board. Real reminders arrive by themselves on the mornings something comes due.'
    : n ? 'These need booking or renewing. Once it is done, put the new date on the board and the reminders for it stop.' : 'Nothing is due this week.';

  const html=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escH(subject)}</title></head>
<body style="margin:0;padding:0;background:#f0efeb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0efeb;padding:32px 16px 48px;"><tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
    <tr><td style="background:#1c3a2b;padding:22px 28px;">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#86b89a;">Duncan's Dog Co. · Vehicles</p>
      <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.2;">${test?'Test reminder':n?(n===1?'1 thing to book':`${n} things to book`):'Mileage check'}</p>
    </td></tr>
    <tr><td style="padding:20px 28px 0;"><p style="margin:0;font-size:14px;color:#444;line-height:1.55;">${intro}</p></td></tr>
    ${section(test?'Due in the next 60 days':'Needs doing', test?[...due,...upcoming]:due, true)}
    ${nudgeHTML}
    ${test?'':section('Coming up in the next 60 days', upcoming, false)}
    <tr><td style="padding:26px 28px 30px;">
      <a href="${BOARD_URL}" style="display:inline-block;background:#1c3a2b;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:8px;">Open the vehicles board</a>
      <p style="margin:14px 0 0;font-size:12px;color:#9ca3af;">Sent ${fmtDate(today)} by the team board at duncansdogco.com/board</p>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
  return { subject, html };
}

export async function sendEmail({ subject, html }, apiKey){
  const res=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
    body:JSON.stringify({ from:"Duncan's Dog Co <forms@duncansdogco.com>", to:['info@duncansdogco.com'], subject, html })
  });
  if(!res.ok) throw new Error('resend '+res.status+' '+await res.text());
}
