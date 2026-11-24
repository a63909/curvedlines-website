import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverMaydayLead } from '../src/lib/mayday-leads.ts';
const env={MAYDAY_SITE_KEY:'mday_site_'+'x'.repeat(43)};
const lead={request_id:'synthetic_request_123',name:'Test',phone:'+15550100001',service:'Test',message:'Synthetic',page:'https://curvedlines.ru'};
const accepted=()=>Response.json({ok:true,result:{status:'queued',message_id:'a'.repeat(64)}},{status:202});
test('optional channel; server-side bearer, TLS, no redirects, bounded timeout',async()=>{
  let seen;
  assert.equal(await deliverMaydayLead(lead,{},async()=>{throw Error('unused');}),false);
  assert.equal(await deliverMaydayLead(lead,env,async(url,options)=>{seen={url,options};return accepted();}),true);
  assert.equal(seen.url.protocol,'https:');assert.equal(seen.options.redirect,'error');
  assert.equal(seen.options.headers.Authorization,'Bearer '+env.MAYDAY_SITE_KEY);
  assert.deepEqual(JSON.parse(seen.options.body),lead);assert.equal(seen.options.signal.aborted,false);
});
test('lost response and temporary failure retry exactly the same lead; no retry on invalid credentials',async()=>{
  const bodies=[];let attempts=0;
  assert.equal(await deliverMaydayLead(lead,env,async(url,options)=>{bodies.push(options.body);attempts++;if(attempts===1)throw Error('network');if(attempts===2)return new Response('',{status:503});return accepted();}),true);
  assert.equal(new Set(bodies).size,1);assert.equal(attempts,3);
  attempts=0;await assert.rejects(deliverMaydayLead(lead,env,async()=>{attempts++;return new Response(env.MAYDAY_SITE_KEY,{status:401});}),/mayday_delivery_failed/);assert.equal(attempts,1);
});
test('invalid config and malformed receipts never report success or disclose response contents',async()=>{
  await assert.rejects(deliverMaydayLead(lead,{...env,MAYDAY_LEADS_URL:'http://example.com'}),/mayday_config_invalid/);
  await assert.rejects(deliverMaydayLead(lead,{MAYDAY_SITE_KEY:'invalid'}),/mayday_config_invalid/);
  await assert.rejects(deliverMaydayLead(lead,env,async()=>Response.json({ok:true},{status:202})),/mayday_delivery_failed/);
});
