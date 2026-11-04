var Ge=Object.create;var he=Object.defineProperty;var ve=Object.getOwnPropertyDescriptor;var Me=Object.getOwnPropertyNames;var ke=Object.getPrototypeOf,He=Object.prototype.hasOwnProperty;var Ye=(l,e)=>()=>{try{return e||l((e={exports:{}}).exports,e),e.exports}catch(r){throw e=0,r}};var Ve=(l,e,r,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let _ of Me(e))!He.call(l,_)&&_!==r&&he(l,_,{get:()=>e[_],enumerable:!(s=ve(e,_))||s.enumerable});return l};var We=(l,e,r)=>(r=l!=null?Ge(ke(l)):{},Ve(e||!l||!l.__esModule?he(r,"default",{value:l,enumerable:!0}):r,l));var Ie=Ye((Dt,be)=>{"use strict";var Ee="autocomplete:reflect",Ze="__autocomplete_",et=/\bmodel\s+\w+\s*@lson\s*\{[^}]*?\bid\s*:\s*'([^']+)'/g;function tt(l){let e=[];for(let r of l.matchAll(et))e.push(r[1]);return e}function rt(l){let r=(l.split(`
`).find(_=>_.startsWith("lapis: "))||l.split(`
`)[0]||"").replace(/^lapis: /,""),s=/^([^\s:]+\.lps):(\d+): (.*)$/.exec(r);return s?{file:s[1],line:Number(s[2]),message:s[3]}:{file:null,line:null,message:r||l.trim()}}function nt(l,{own:e=!1,log:r=()=>{}}={}){let s=[];for(let t of l.split(`
`))if(t.trim())try{s.push(JSON.parse(t))}catch{r(`unreadable reflection line: ${t.slice(0,200)}`)}if(e)return s;let _=new Set(s.filter(t=>t.record==="type"&&t.model===Ee).map(t=>t.name));return s.filter(t=>t.id!==Ee&&!_.has(t.name)&&!_.has(t.owner))}be.exports={REFLECT_MODEL:Ee,REFLECT_PREFIX:Ze,modelIds:tt,parseError:rt,parseRecords:nt}});var k=class l{static read_bytes(e,r){let s=new l;return s.buf=e.getUint32(r,!0),s.buf_len=e.getUint32(r+4,!0),s}static read_bytes_array(e,r,s){let _=[];for(let t=0;t<s;t++)_.push(l.read_bytes(e,r+8*t));return _}},H=class l{static read_bytes(e,r){let s=new l;return s.buf=e.getUint32(r,!0),s.buf_len=e.getUint32(r+4,!0),s}static read_bytes_array(e,r,s){let _=[];for(let t=0;t<s;t++)_.push(l.read_bytes(e,r+8*t));return _}},oe=0,ae=1,Q=2;var le=2,m=3,G=4;var B=class{head_length(){return 24}name_length(){return this.dir_name.byteLength}write_head_bytes(e,r){e.setBigUint64(r,this.d_next,!0),e.setBigUint64(r+8,this.d_ino,!0),e.setUint32(r+16,this.dir_name.length,!0),e.setUint8(r+20,this.d_type)}write_name_bytes(e,r,s){e.set(this.dir_name.slice(0,Math.min(this.dir_name.byteLength,s)),r)}constructor(e,r,s,_){let t=new TextEncoder().encode(s);this.d_next=e,this.d_ino=r,this.d_namlen=t.byteLength,this.d_type=_,this.dir_name=t}};var fe=1;var C=class{write_bytes(e,r){e.setUint8(r,this.fs_filetype),e.setUint16(r+2,this.fs_flags,!0),e.setBigUint64(r+8,this.fs_rights_base,!0),e.setBigUint64(r+16,this.fs_rights_inherited,!0)}constructor(e,r){this.fs_rights_base=0n,this.fs_rights_inherited=0n,this.fs_filetype=e,this.fs_flags=r}};var q=1,v=2,_e=4,Z=8,U=class{write_bytes(e,r){e.setBigUint64(r,this.dev,!0),e.setBigUint64(r+8,this.ino,!0),e.setUint8(r+16,this.filetype),e.setBigUint64(r+24,this.nlink,!0),e.setBigUint64(r+32,this.size,!0),e.setBigUint64(r+38,this.atim,!0),e.setBigUint64(r+46,this.mtim,!0),e.setBigUint64(r+52,this.ctim,!0)}constructor(e,r,s){this.dev=0n,this.nlink=0n,this.atim=0n,this.mtim=0n,this.ctim=0n,this.ino=e,this.filetype=r,this.size=s}},Ne=0;var Oe=1,J=class l{static read_bytes(e,r){return new l(e.getBigUint64(r,!0),e.getUint8(r+8),e.getUint32(r+16,!0),e.getBigUint64(r+24,!0),e.getUint16(r+36,!0))}constructor(e,r,s,_,t){this.userdata=e,this.eventtype=r,this.clockid=s,this.timeout=_,this.flags=t}},$=class{write_bytes(e,r){e.setBigUint64(r,this.userdata,!0),e.setUint16(r+8,this.error,!0),e.setUint8(r+10,this.eventtype)}constructor(e,r,s){this.userdata=e,this.error=r,this.eventtype=s}};var je=0,ie=class{write_bytes(e,r){e.setUint32(r,this.pr_name.byteLength,!0)}constructor(e){this.pr_name=new TextEncoder().encode(e)}},X=class l{static dir(e){let r=new l;return r.tag=je,r.inner=new ie(e),r}write_bytes(e,r){e.setUint32(r,this.tag,!0),this.inner.write_bytes(e,r+4)}};var Ke=class{enable(e){this.log=ze(e===void 0?!0:e,this.prefix)}get enabled(){return this.isEnabled}constructor(e){this.isEnabled=e,this.prefix="wasi:",this.enable(e)}};function ze(l,e){return l?console.log.bind(console,"%c%s","color: #265BA0",e):()=>{}}var y=new Ke(!1);var F=class extends Error{constructor(e){super("exit with exit code "+e),this.code=e}},de=class{start(e){this.inst=e;try{return e.exports._start(),0}catch(r){if(r instanceof F)return r.code;throw r}}initialize(e){this.inst=e,e.exports._initialize&&e.exports._initialize()}constructor(e,r,s,_={}){this.args=[],this.env=[],this.fds=[],y.enable(_.debug),this.args=e,this.env=r,this.fds=s;let t=this;this.wasiImport={args_sizes_get(n,i){let o=new DataView(t.inst.exports.memory.buffer);o.setUint32(n,t.args.length,!0);let a=0;for(let f of t.args)a+=f.length+1;return o.setUint32(i,a,!0),y.log(o.getUint32(n,!0),o.getUint32(i,!0)),0},args_get(n,i){let o=new DataView(t.inst.exports.memory.buffer),a=new Uint8Array(t.inst.exports.memory.buffer),f=i;for(let c=0;c<t.args.length;c++){o.setUint32(n,i,!0),n+=4;let d=new TextEncoder().encode(t.args[c]);a.set(d,i),o.setUint8(i+d.length,0),i+=d.length+1}return y.enabled&&y.log(new TextDecoder("utf-8").decode(a.slice(f,i))),0},environ_sizes_get(n,i){let o=new DataView(t.inst.exports.memory.buffer);o.setUint32(n,t.env.length,!0);let a=0;for(let f of t.env)a+=new TextEncoder().encode(f).length+1;return o.setUint32(i,a,!0),y.log(o.getUint32(n,!0),o.getUint32(i,!0)),0},environ_get(n,i){let o=new DataView(t.inst.exports.memory.buffer),a=new Uint8Array(t.inst.exports.memory.buffer),f=i;for(let c=0;c<t.env.length;c++){o.setUint32(n,i,!0),n+=4;let d=new TextEncoder().encode(t.env[c]);a.set(d,i),o.setUint8(i+d.length,0),i+=d.length+1}return y.enabled&&y.log(new TextDecoder("utf-8").decode(a.slice(f,i))),0},clock_res_get(n,i){let o;switch(n){case 1:{o=5000n;break}case 0:{o=1000000n;break}default:return 52}return new DataView(t.inst.exports.memory.buffer).setBigUint64(i,o,!0),0},clock_time_get(n,i,o){let a=new DataView(t.inst.exports.memory.buffer);if(n===0)a.setBigUint64(o,BigInt(new Date().getTime())*1000000n,!0);else if(n==1){let f;try{f=BigInt(Math.round(performance.now()*1e6))}catch{f=0n}a.setBigUint64(o,f,!0)}else a.setBigUint64(o,0n,!0);return 0},fd_advise(n,i,o,a){return t.fds[n]!=null?0:8},fd_allocate(n,i,o){return t.fds[n]!=null?t.fds[n].fd_allocate(i,o):8},fd_close(n){if(t.fds[n]!=null){let i=t.fds[n].fd_close();return t.fds[n]=void 0,i}else return 8},fd_datasync(n){return t.fds[n]!=null?t.fds[n].fd_sync():8},fd_fdstat_get(n,i){if(t.fds[n]!=null){let{ret:o,fdstat:a}=t.fds[n].fd_fdstat_get();return a?.write_bytes(new DataView(t.inst.exports.memory.buffer),i),o}else return 8},fd_fdstat_set_flags(n,i){return t.fds[n]!=null?t.fds[n].fd_fdstat_set_flags(i):8},fd_fdstat_set_rights(n,i,o){return t.fds[n]!=null?t.fds[n].fd_fdstat_set_rights(i,o):8},fd_filestat_get(n,i){if(t.fds[n]!=null){let{ret:o,filestat:a}=t.fds[n].fd_filestat_get();return a?.write_bytes(new DataView(t.inst.exports.memory.buffer),i),o}else return 8},fd_filestat_set_size(n,i){return t.fds[n]!=null?t.fds[n].fd_filestat_set_size(i):8},fd_filestat_set_times(n,i,o,a){return t.fds[n]!=null?t.fds[n].fd_filestat_set_times(i,o,a):8},fd_pread(n,i,o,a,f){let c=new DataView(t.inst.exports.memory.buffer),d=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let p=k.read_bytes_array(c,i,o),E=0;for(let u of p){let{ret:w,data:O}=t.fds[n].fd_pread(u.buf_len,a);if(w!=0)return c.setUint32(f,E,!0),w;if(d.set(O,u.buf),E+=O.length,a+=BigInt(O.length),O.length!=u.buf_len)break}return c.setUint32(f,E,!0),0}else return 8},fd_prestat_get(n,i){let o=new DataView(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let{ret:a,prestat:f}=t.fds[n].fd_prestat_get();return f?.write_bytes(o,i),a}else return 8},fd_prestat_dir_name(n,i,o){if(t.fds[n]!=null){let{ret:a,prestat:f}=t.fds[n].fd_prestat_get();if(f==null)return a;let c=f.inner.pr_name;return new Uint8Array(t.inst.exports.memory.buffer).set(c.slice(0,o),i),c.byteLength>o?37:0}else return 8},fd_pwrite(n,i,o,a,f){let c=new DataView(t.inst.exports.memory.buffer),d=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let p=H.read_bytes_array(c,i,o),E=0;for(let u of p){let w=d.slice(u.buf,u.buf+u.buf_len),{ret:O,nwritten:g}=t.fds[n].fd_pwrite(w,a);if(O!=0)return c.setUint32(f,E,!0),O;if(E+=g,a+=BigInt(g),g!=w.byteLength)break}return c.setUint32(f,E,!0),0}else return 8},fd_read(n,i,o,a){let f=new DataView(t.inst.exports.memory.buffer),c=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let d=k.read_bytes_array(f,i,o),p=0;for(let E of d){let{ret:u,data:w}=t.fds[n].fd_read(E.buf_len);if(u!=0)return f.setUint32(a,p,!0),u;if(c.set(w,E.buf),p+=w.length,w.length!=E.buf_len)break}return f.setUint32(a,p,!0),0}else return 8},fd_readdir(n,i,o,a,f){let c=new DataView(t.inst.exports.memory.buffer),d=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let p=0;for(;;){let{ret:E,dirent:u}=t.fds[n].fd_readdir_single(a);if(E!=0)return c.setUint32(f,p,!0),E;if(u==null)break;if(o-p<u.head_length()){p=o;break}let w=new ArrayBuffer(u.head_length());if(u.write_head_bytes(new DataView(w),0),d.set(new Uint8Array(w).slice(0,Math.min(w.byteLength,o-p)),i),i+=u.head_length(),p+=u.head_length(),o-p<u.name_length()){p=o;break}u.write_name_bytes(d,i,o-p),i+=u.name_length(),p+=u.name_length(),a=u.d_next}return c.setUint32(f,p,!0),0}else return 8},fd_renumber(n,i){if(t.fds[n]!=null&&t.fds[i]!=null){let o=t.fds[i].fd_close();return o!=0?o:(t.fds[i]=t.fds[n],t.fds[n]=void 0,0)}else return 8},fd_seek(n,i,o,a){let f=new DataView(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let{ret:c,offset:d}=t.fds[n].fd_seek(i,o);return f.setBigInt64(a,d,!0),c}else return 8},fd_sync(n){return t.fds[n]!=null?t.fds[n].fd_sync():8},fd_tell(n,i){let o=new DataView(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let{ret:a,offset:f}=t.fds[n].fd_tell();return o.setBigUint64(i,f,!0),a}else return 8},fd_write(n,i,o,a){let f=new DataView(t.inst.exports.memory.buffer),c=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let d=H.read_bytes_array(f,i,o),p=0;for(let E of d){let u=c.slice(E.buf,E.buf+E.buf_len),{ret:w,nwritten:O}=t.fds[n].fd_write(u);if(w!=0)return f.setUint32(a,p,!0),w;if(p+=O,O!=u.byteLength)break}return f.setUint32(a,p,!0),0}else return 8},path_create_directory(n,i,o){let a=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let f=new TextDecoder("utf-8").decode(a.slice(i,i+o));return t.fds[n].path_create_directory(f)}else return 8},path_filestat_get(n,i,o,a,f){let c=new DataView(t.inst.exports.memory.buffer),d=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let p=new TextDecoder("utf-8").decode(d.slice(o,o+a)),{ret:E,filestat:u}=t.fds[n].path_filestat_get(i,p);return u?.write_bytes(c,f),E}else return 8},path_filestat_set_times(n,i,o,a,f,c,d){let p=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let E=new TextDecoder("utf-8").decode(p.slice(o,o+a));return t.fds[n].path_filestat_set_times(i,E,f,c,d)}else return 8},path_link(n,i,o,a,f,c,d){let p=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null&&t.fds[f]!=null){let E=new TextDecoder("utf-8").decode(p.slice(o,o+a)),u=new TextDecoder("utf-8").decode(p.slice(c,c+d)),{ret:w,inode_obj:O}=t.fds[n].path_lookup(E,i);return O==null?w:t.fds[f].path_link(u,O,!1)}else return 8},path_open(n,i,o,a,f,c,d,p,E){let u=new DataView(t.inst.exports.memory.buffer),w=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let O=new TextDecoder("utf-8").decode(w.slice(o,o+a));y.log(O);let{ret:g,fd_obj:se}=t.fds[n].path_open(i,O,f,c,d,p);if(g!=0)return g;t.fds.push(se);let z=t.fds.length-1;return u.setUint32(E,z,!0),0}else return 8},path_readlink(n,i,o,a,f,c){let d=new DataView(t.inst.exports.memory.buffer),p=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let E=new TextDecoder("utf-8").decode(p.slice(i,i+o));y.log(E);let{ret:u,data:w}=t.fds[n].path_readlink(E);if(w!=null){let O=new TextEncoder().encode(w);if(O.length>f)return d.setUint32(c,0,!0),8;p.set(O,a),d.setUint32(c,O.length,!0)}return u}else return 8},path_remove_directory(n,i,o){let a=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let f=new TextDecoder("utf-8").decode(a.slice(i,i+o));return t.fds[n].path_remove_directory(f)}else return 8},path_rename(n,i,o,a,f,c){let d=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null&&t.fds[a]!=null){let p=new TextDecoder("utf-8").decode(d.slice(i,i+o)),E=new TextDecoder("utf-8").decode(d.slice(f,f+c)),{ret:u,inode_obj:w}=t.fds[n].path_unlink(p);if(w==null)return u;if(u=t.fds[a].path_link(E,w,!0),u!=0&&t.fds[n].path_link(p,w,!0)!=0)throw"path_link should always return success when relinking an inode back to the original place";return u}else return 8},path_symlink(n,i,o,a,f){let c=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[o]!=null){let d=new TextDecoder("utf-8").decode(c.slice(n,n+i)),p=new TextDecoder("utf-8").decode(c.slice(a,a+f));return 58}else return 8},path_unlink_file(n,i,o){let a=new Uint8Array(t.inst.exports.memory.buffer);if(t.fds[n]!=null){let f=new TextDecoder("utf-8").decode(a.slice(i,i+o));return t.fds[n].path_unlink_file(f)}else return 8},poll_oneoff(n,i,o){if(o===0)return 28;if(o>1)return y.log("poll_oneoff: only a single subscription is supported"),58;let a=new DataView(t.inst.exports.memory.buffer),f=J.read_bytes(a,n),c=f.eventtype,d=f.clockid,p=f.timeout;if(c!==Ne)return y.log("poll_oneoff: only clock subscriptions are supported"),58;let E;if(d===1)E=()=>BigInt(Math.round(performance.now()*1e6));else if(d===0)E=()=>BigInt(new Date().getTime())*1000000n;else return 28;let u=(f.flags&Oe)!==0?p:E()+p;for(;u>E(););return new $(f.userdata,0,c).write_bytes(a,i),0},proc_exit(n){throw new F(n)},proc_raise(n){throw"raised signal "+n},sched_yield(){},random_get(n,i){let o=new Uint8Array(t.inst.exports.memory.buffer).subarray(n,n+i);if("crypto"in globalThis&&(typeof SharedArrayBuffer>"u"||!(t.inst.exports.memory.buffer instanceof SharedArrayBuffer)))for(let a=0;a<i;a+=65536)crypto.getRandomValues(o.subarray(a,a+65536));else for(let a=0;a<i;a++)o[a]=Math.random()*256|0},sock_recv(n,i,o){throw"sockets not supported"},sock_send(n,i,o){throw"sockets not supported"},sock_shutdown(n,i){throw"sockets not supported"},sock_accept(n,i){throw"sockets not supported"}}}};var I=class{fd_allocate(e,r){return 58}fd_close(){return 0}fd_fdstat_get(){return{ret:58,fdstat:null}}fd_fdstat_set_flags(e){return 58}fd_fdstat_set_rights(e,r){return 58}fd_filestat_get(){return{ret:58,filestat:null}}fd_filestat_set_size(e){return 58}fd_filestat_set_times(e,r,s){return 58}fd_pread(e,r){return{ret:58,data:new Uint8Array}}fd_prestat_get(){return{ret:58,prestat:null}}fd_pwrite(e,r){return{ret:58,nwritten:0}}fd_read(e){return{ret:58,data:new Uint8Array}}fd_readdir_single(e){return{ret:58,dirent:null}}fd_seek(e,r){return{ret:58,offset:0n}}fd_sync(){return 0}fd_tell(){return{ret:58,offset:0n}}fd_write(e){return{ret:58,nwritten:0}}path_create_directory(e){return 58}path_filestat_get(e,r){return{ret:58,filestat:null}}path_filestat_set_times(e,r,s,_,t){return 58}path_link(e,r,s){return 58}path_unlink(e){return{ret:58,inode_obj:null}}path_lookup(e,r){return{ret:58,inode_obj:null}}path_open(e,r,s,_,t,n){return{ret:54,fd_obj:null}}path_readlink(e){return{ret:58,data:null}}path_remove_directory(e){return 58}path_rename(e,r,s){return 58}path_unlink_file(e){return 58}},S=class l{static issue_ino(){return l.next_ino++}static root_ino(){return 0n}constructor(){this.ino=l.issue_ino()}};S.next_ino=1n;var M=class extends I{fd_allocate(e,r){if(!(this.file.size>e+r)){let s=new Uint8Array(Number(e+r));s.set(this.file.data,0),this.file.data=s}return 0}fd_fdstat_get(){return{ret:0,fdstat:new C(G,0)}}fd_filestat_set_size(e){if(this.file.size>e)this.file.data=new Uint8Array(this.file.data.buffer.slice(0,Number(e)));else{let r=new Uint8Array(Number(e));r.set(this.file.data,0),this.file.data=r}return 0}fd_read(e){let r=this.file.data.slice(Number(this.file_pos),Number(this.file_pos+BigInt(e)));return this.file_pos+=BigInt(r.length),{ret:0,data:r}}fd_pread(e,r){return{ret:0,data:this.file.data.slice(Number(r),Number(r+BigInt(e)))}}fd_seek(e,r){let s;switch(r){case oe:s=e;break;case ae:s=this.file_pos+e;break;case Q:s=BigInt(this.file.data.byteLength)+e;break;default:return{ret:28,offset:0n}}return s<0?{ret:28,offset:0n}:(this.file_pos=s,{ret:0,offset:this.file_pos})}fd_tell(){return{ret:0,offset:this.file_pos}}fd_write(e){if(this.file.readonly)return{ret:8,nwritten:0};if(this.file_pos+BigInt(e.byteLength)>this.file.size){let r=this.file.data;this.file.data=new Uint8Array(Number(this.file_pos+BigInt(e.byteLength))),this.file.data.set(r)}return this.file.data.set(e,Number(this.file_pos)),this.file_pos+=BigInt(e.byteLength),{ret:0,nwritten:e.byteLength}}fd_pwrite(e,r){if(this.file.readonly)return{ret:8,nwritten:0};if(r+BigInt(e.byteLength)>this.file.size){let s=this.file.data;this.file.data=new Uint8Array(Number(r+BigInt(e.byteLength))),this.file.data.set(s)}return this.file.data.set(e,Number(r)),{ret:0,nwritten:e.byteLength}}fd_filestat_get(){return{ret:0,filestat:this.file.stat()}}constructor(e){super(),this.file_pos=0n,this.file=e}},V=class extends I{fd_seek(e,r){return{ret:8,offset:0n}}fd_tell(){return{ret:8,offset:0n}}fd_allocate(e,r){return 8}fd_fdstat_get(){return{ret:0,fdstat:new C(m,0)}}fd_readdir_single(e){if(y.enabled&&(y.log("readdir_single",e),y.log(e,this.dir.contents.keys())),e==0n)return{ret:0,dirent:new B(1n,this.dir.ino,".",m)};if(e==1n)return{ret:0,dirent:new B(2n,this.dir.parent_ino(),"..",m)};if(e>=BigInt(this.dir.contents.size)+2n)return{ret:0,dirent:null};let[r,s]=Array.from(this.dir.contents.entries())[Number(e-2n)];return{ret:0,dirent:new B(e+1n,s.ino,r,s.stat().filetype)}}path_filestat_get(e,r){let{ret:s,path:_}=A.from(r);if(_==null)return{ret:s,filestat:null};let{ret:t,entry:n}=this.dir.get_entry_for_path(_);return n==null?{ret:t,filestat:null}:{ret:0,filestat:n.stat()}}path_lookup(e,r){let{ret:s,path:_}=A.from(e);if(_==null)return{ret:s,inode_obj:null};let{ret:t,entry:n}=this.dir.get_entry_for_path(_);return n==null?{ret:t,inode_obj:null}:{ret:0,inode_obj:n}}path_open(e,r,s,_,t,n){let{ret:i,path:o}=A.from(r);if(o==null)return{ret:i,fd_obj:null};let{ret:a,entry:f}=this.dir.get_entry_for_path(o);if(f==null){if(a!=44)return{ret:a,fd_obj:null};if((s&q)==q){let{ret:c,entry:d}=this.dir.create_entry_for_path(r,(s&v)==v);if(d==null)return{ret:c,fd_obj:null};f=d}else return{ret:44,fd_obj:null}}else if((s&_e)==_e)return{ret:20,fd_obj:null};return(s&v)==v&&f.stat().filetype!==m?{ret:54,fd_obj:null}:f.path_open(s,_,n)}path_create_directory(e){return this.path_open(0,e,q|v,0n,0n,0).ret}path_link(e,r,s){let{ret:_,path:t}=A.from(e);if(t==null)return _;if(t.is_dir)return 44;let{ret:n,parent_entry:i,filename:o,entry:a}=this.dir.get_parent_dir_and_entry_for_path(t,!0);if(i==null||o==null)return n;if(a!=null){let f=r.stat().filetype==m,c=a.stat().filetype==m;if(f&&c)if(s&&a instanceof L){if(a.contents.size!=0)return 55}else return 20;else{if(f&&!c)return 54;if(!f&&c)return 31;if(!(r.stat().filetype==G&&a.stat().filetype==G))return 20}}return!s&&r.stat().filetype==m?63:(i.contents.set(o,r),0)}path_unlink(e){let{ret:r,path:s}=A.from(e);if(s==null)return{ret:r,inode_obj:null};let{ret:_,parent_entry:t,filename:n,entry:i}=this.dir.get_parent_dir_and_entry_for_path(s,!0);return t==null||n==null?{ret:_,inode_obj:null}:i==null?{ret:44,inode_obj:null}:(t.contents.delete(n),{ret:0,inode_obj:i})}path_unlink_file(e){let{ret:r,path:s}=A.from(e);if(s==null)return r;let{ret:_,parent_entry:t,filename:n,entry:i}=this.dir.get_parent_dir_and_entry_for_path(s,!1);return t==null||n==null||i==null?_:i.stat().filetype===m?31:(t.contents.delete(n),0)}path_remove_directory(e){let{ret:r,path:s}=A.from(e);if(s==null)return r;let{ret:_,parent_entry:t,filename:n,entry:i}=this.dir.get_parent_dir_and_entry_for_path(s,!1);return t==null||n==null||i==null?_:!(i instanceof L)||i.stat().filetype!==m?54:i.contents.size!==0?55:t.contents.delete(n)?0:44}fd_filestat_get(){return{ret:0,filestat:this.dir.stat()}}fd_filestat_set_size(e){return 8}fd_read(e){return{ret:8,data:new Uint8Array}}fd_pread(e,r){return{ret:8,data:new Uint8Array}}fd_write(e){return{ret:8,nwritten:0}}fd_pwrite(e,r){return{ret:8,nwritten:0}}constructor(e){super(),this.dir=e}},W=class extends V{fd_prestat_get(){return{ret:0,prestat:X.dir(this.prestat_name)}}constructor(e,r){super(new L(r)),this.prestat_name=e}},D=class extends S{path_open(e,r,s){if(this.readonly&&(r&BigInt(64))==BigInt(64))return{ret:63,fd_obj:null};if((e&Z)==Z){if(this.readonly)return{ret:63,fd_obj:null};this.data=new Uint8Array([])}let _=new M(this);return s&fe&&_.fd_seek(0n,Q),{ret:0,fd_obj:_}}get size(){return BigInt(this.data.byteLength)}stat(){return new U(this.ino,G,this.size)}constructor(e,r){super(),this.data=new Uint8Array(e),this.readonly=!!r?.readonly}},A=class Se{static from(e){let r=new Se;if(r.is_dir=e.endsWith("/"),e.startsWith("/"))return{ret:76,path:null};if(e.includes("\0"))return{ret:28,path:null};for(let s of e.split("/"))if(!(s===""||s===".")){if(s===".."){if(r.parts.pop()==null)return{ret:76,path:null};continue}r.parts.push(s)}return{ret:0,path:r}}to_path_string(){let e=this.parts.join("/");return this.is_dir&&(e+="/"),e}constructor(){this.parts=[],this.is_dir=!1}},L=class l extends S{parent_ino(){return this.parent==null?S.root_ino():this.parent.ino}path_open(e,r,s){return{ret:0,fd_obj:new V(this)}}stat(){return new U(this.ino,m,0n)}get_entry_for_path(e){let r=this;for(let s of e.parts){if(!(r instanceof l))return{ret:54,entry:null};let _=r.contents.get(s);if(_!==void 0)r=_;else return y.log(s),{ret:44,entry:null}}return e.is_dir&&r.stat().filetype!=m?{ret:54,entry:null}:{ret:0,entry:r}}get_parent_dir_and_entry_for_path(e,r){let s=e.parts.pop();if(s===void 0)return{ret:28,parent_entry:null,filename:null,entry:null};let{ret:_,entry:t}=this.get_entry_for_path(e);if(t==null)return{ret:_,parent_entry:null,filename:null,entry:null};if(!(t instanceof l))return{ret:54,parent_entry:null,filename:null,entry:null};let n=t.contents.get(s);return n===void 0?r?{ret:0,parent_entry:t,filename:s,entry:null}:{ret:44,parent_entry:null,filename:null,entry:null}:e.is_dir&&n.stat().filetype!=m?{ret:54,parent_entry:null,filename:null,entry:null}:{ret:0,parent_entry:t,filename:s,entry:n}}create_entry_for_path(e,r){let{ret:s,path:_}=A.from(e);if(_==null)return{ret:s,entry:null};let{ret:t,parent_entry:n,filename:i,entry:o}=this.get_parent_dir_and_entry_for_path(_,!0);if(n==null||i==null)return{ret:t,entry:null};if(o!=null)return{ret:20,entry:null};y.log("create",_);let a;return r?a=new l(new Map):a=new D(new ArrayBuffer(0)),n.contents.set(i,a),o=a,{ret:0,entry:o}}constructor(e){super(),this.parent=null,e instanceof Array?this.contents=new Map(e):this.contents=e;for(let r of this.contents.values())r instanceof l&&(r.parent=this)}},j=class l extends I{fd_filestat_get(){return{ret:0,filestat:new U(this.ino,le,BigInt(0))}}fd_fdstat_get(){let e=new C(le,0);return e.fs_rights_base=BigInt(64),{ret:0,fdstat:e}}fd_write(e){return this.write(e),{ret:0,nwritten:e.byteLength}}static lineBuffered(e){let r=new TextDecoder("utf-8",{fatal:!1}),s="";return new l(_=>{s+=r.decode(_,{stream:!0});let t=s.split(`
`);for(let[n,i]of t.entries())n<t.length-1?e(i):s=i})}constructor(e){super(),this.ino=S.issue_ino(),this.write=e}};var K="/lapis";function Xe(l){let e=atob(l),r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r}function xe(l){let e={};for(let[r,s]of Object.entries(l.entries))e[r]=s.type==="file"?Xe(s.data):xe(s);return e}function pe(l,e){let r=l;for(let t of e.split("/").filter(Boolean))r=r?.[t];if(!r||r instanceof Uint8Array)return{};let s=new TextDecoder,_={};for(let[t,n]of Object.entries(r))n instanceof Uint8Array&&(_[t]=s.decode(n));return _}function Qe(l,e){let r=new TextEncoder,s=structuredClone(l);for(let[t,n]of Object.entries(e||{})){let i=t.split("/").filter(Boolean),o=s;for(let a of i.slice(0,-1))(!o[a]||o[a]instanceof Uint8Array)&&(o[a]={}),o=o[a];o[i[i.length-1]]={writable:typeof n=="string"?r.encode(n):n}}let _=t=>new Map(Object.entries(t).map(([n,i])=>i instanceof Uint8Array?[n,new D(i,{readonly:!0})]:i.writable?[n,new D(i.writable)]:[n,new L(_(i))]));return _(s)}var qe="20261104172207",ne=new Map;function ge(l){let e=l.endsWith("/")?l:l+"/";if(!ne.has(e)){let r=`?v=${encodeURIComponent(qe)}`,s=(async()=>{let[_,t]=await Promise.all([fetch(new URL("lapis.wasm"+r,e)),fetch(new URL("root.json"+r,e))]);if(!_.ok)throw new Error(`failed to fetch lapis.wasm: ${_.status}`);if(!t.ok)throw new Error(`failed to fetch root.json: ${t.status}`);return{wasm:await WebAssembly.compile(await _.arrayBuffer()),tree:xe(await t.json())}})();s.catch(()=>ne.delete(e)),ne.set(e,s)}return ne.get(e)}async function Re(l,e,r={}){let{stdin:s="",files:_,onStdout:t,onStderr:n}=r,i=[],o=[],f=new TextEncoder().encode(s.endsWith(`
`)||s===""?s:s+`
`),c=(w,O)=>{let g=new TextDecoder;return new j(se=>{let z=g.decode(se,{stream:!0});w.push(z),O?.(z)})},d=[new M(new D(f)),c(i,t),c(o,n),new W(K,Qe(l.tree,_))],p=new de(["lapis",...e],[`LAPIS_ROOT=${K}`],d,{debug:!1}),E=await WebAssembly.instantiate(l.wasm,{wasi_snapshot_preview1:p.wasiImport}),u=0;try{u=p.start(E)}catch(w){if(w instanceof F)u=w.code;else if(w instanceof WebAssembly.RuntimeError)o.push(`lapis: host crashed (${w.message})
`),u=134;else throw w}return{exitCode:u,stdout:i.join(""),stderr:o.join("")}}var T=We(Ie(),1);var Ae=`# What the language server knows about a model, read from modeled reflection alone.
# Nothing here names a domain type: it starts from model ids, follows dependencies, and
# describes every type and property as one JSON record per line.
#
#   {"record":"model",    "id", "intrinsic", "dependencies"}
#   {"record":"type",     "model", "name", "meta", "abstract", "evaluable", "metaData",
#                         "evaluatesTo", "superTypes", "annotations", "constants"}
#   {"record":"property", "owner", "name", "type", "declaringType", "required",
#                         "default", "description", "annotations"}
#   {"record":"missing",  "id"}
#
# \`property\` records are effective: inherited properties are listed under each subtype,
# as \`EffectiveProperties\` resolves them.

%model hackathon:lson#[0.1,0.2)
%model hackathon:views#[0.1,0.2)

model Reflect @lson {
  id: 'autocomplete:reflect',
  stability: 'evolving'
} {
  entity ReflectResult {
    output: list<string> = list<string> []
    errors: list<string> = list<string> []
    exitCode: integer = 0
  }

  # The document's entry point. \`ids\` are the models to describe, with their dependencies.
  entity DescribeModels: ReflectResult {
    ids: list<string>
  }

  entity DescribeType: list<string> {
    type: Type
  }

  # A property's value when it is set. Reading an absent property faults.
  entity ReadOptional: Option {
    value: Entity
    name: string
  }

  entity DescribeAnnotations: string {
    metaData: set<MetaData>
  }

  # A metadata entry as it would be written: \`@Type {name: value}\`.
  entity DescribeMetaData: string {
    metaData: MetaData
  }

  # A value as it would be written in a metadata body, kept short.
  entity DescribeValue: string {
    value: Base
    depth: integer = 0
  }

  entity JsonText: string {
    text: string
  }

  entity JsonList: string {
    items: list<string>
  }
}

expert function describeModels(evaluable: DescribeModels): ReflectResult {
  let lines = list<string> []
  let models = list<Model> []
  let seen = set<string> []

  for id in evaluable.ids {
    match Models.find(id) {
      None {
        lines.add('{"record":"missing","id":' + JsonText(text: id) + '}')
      }
      Some as found {
        let model = found.value

        if seen.has(model.name) == false {
          seen.add(model.name)
          models.add(model)
        }
      }
    }
  }

  let index = 0

  while index < models.size {
    let model = models.get(index)
    index = index + 1

    let dependencies = list<string> []

    for dependency in model.dependencies {
      dependencies.add(JsonText(text: dependency.name))

      if seen.has(dependency.name) == false {
        seen.add(dependency.name)
        models.add(dependency)
      }
    }

    lines.add('{"record":"model","id":' + JsonText(text: model.name) + ',"intrinsic":' + "\${model.intrinsic}" + ',"dependencies":' + JsonList(items: dependencies) + '}')

    for type in model.types {
      for line in DescribeType(type: type) {
        lines.add(line)
      }
    }
  }

  return ReflectResult { output: lines }
}

expert function describeType(evaluable: DescribeType): list<string> {
  let lines = list<string> []
  let name = JsonText(text: evaluable.type.typeSignature)
  let record = '{"record":"type","model":' + JsonText(text: evaluable.type.declaringModel.name) + ',"name":' + name + ',"meta":' + JsonText(text: evaluable.type.type().name)

  match evaluable.type {
    EnumType as type {
      let constants = list<string> []

      for constant in type.constants {
        constants.add(JsonText(text: constant.name))
      }

      record = record + ',"annotations":' + DescribeAnnotations(metaData: type.metaData) + ',"constants":' + JsonList(items: constants)
    }
    EntityType as type {
      let behaviour = type.reflectionType()
      let superTypes = list<string> []

      for parent in type.superTypes {
        superTypes.add(JsonText(text: parent.typeSignature))
      }

      record = record + ',"annotations":' + DescribeAnnotations(metaData: type.metaData)
      record = record + ',"abstract":' + "\${type.isAbstract}" + ',"evaluable":' + "\${behaviour.isEvaluable()}"
      record = record + ',"metaData":' + "\${behaviour.isAssignableTo(?MetaData)}" + ',"superTypes":' + JsonList(items: superTypes)

      match ReadOptional(value: type, name: 'evaluatesTo') {
        None {}
        Some as result {
          record = record + ',"evaluatesTo":' + JsonText(text: result.value.typeSignature)
        }
      }

      for property in EffectiveProperties(type: type) {
        let line = '{"record":"property","owner":' + name + ',"name":' + JsonText(text: property.name)
        line = line + ',"type":' + JsonText(text: property.type.typeSignature)
        line = line + ',"declaringType":' + JsonText(text: property.declaringType.typeSignature)
        line = line + ',"required":' + "\${property.required}" + ',"annotations":' + DescribeAnnotations(metaData: property.metaData)

        match ReadOptional(value: property, name: 'default') {
          None {}
          Some as present {
            line = line + ',"default":' + JsonText(text: DescribeValue(value: present.value))
          }
        }

        match ReadOptional(value: property, name: 'description') {
          None {}
          Some as present {
            line = line + ',"description":' + JsonText(text: "\${present.value}")
          }
        }

        lines.add(line + '}')
      }
    }
    Type {}
  }

  lines.add(record + '}')
  return lines
}

expert function describeAnnotations(evaluable: DescribeAnnotations): string {
  let annotations = list<string> []

  for md in evaluable.metaData {
    annotations.add(JsonText(text: DescribeMetaData(metaData: md)))
  }

  return JsonList(items: annotations)
}

expert function readOptional(evaluable: ReadOptional): Option {
  for property in EffectiveProperties(type: evaluable.value.type().manifest()) {
    if property.name == evaluable.name {
      return property.reflectionProperty().get(evaluable.value)
    }
  }

  return None {}
}

# Only what the metadata type adds is shown, since MetaData's own bookkeeping
# (inherited, priority, selector) is the same for every entry.
expert function describeMetaData(evaluable: DescribeMetaData): string {
  let md = evaluable.metaData
  let type = md.type().manifest()
  let fields = list<string> []

  for property in EffectiveProperties(type: type) {
    if property.declaringType.typeSignature != 'MetaData' || property.name == 'name' || property.name == 'value' {
      match property.reflectionProperty().get(md) {
        None {}
        Some as present {
          fields.add(property.name + ': ' + DescribeValue(value: present.value, depth: 1))
        }
      }
    }
  }

  if fields.size == 0 {
    return '@' + type.typeSignature
  }

  return '@' + type.typeSignature + ' {' + Join(parts: fields, separator: ', ') + '}'
}

expert function describeValue(evaluable: DescribeValue): string {
  let value = evaluable.value
  let kind = value.type().kind()

  if kind == TypeKind.list || kind == TypeKind.set {
    let items = list<string> []

    for element in value {
      items.add(DescribeValue(value: element, depth: evaluable.depth + 1))
    }

    let open = '['

    if kind == TypeKind.set {
      open = 'set ['
    }

    return open + Join(parts: items, separator: ', ') + ']'
  }

  # Keys may be types, which have no type of their own to ask.
  if kind == TypeKind.map {
    if value.size == 0 {
      return 'map {}'
    }

    return 'map {\u2026}'
  }

  if kind == TypeKind.entity {
    let type = value.type()

    if type.isAssignableTo(?Property) {
      return '~' + value.declaringType.typeSignature + '.' + value.name
    }

    if type.isAssignableTo(?Type) {
      return value.typeSignature
    }

    if evaluable.depth > 2 {
      return type.name + ' {\u2026}'
    }

    let fields = list<string> []

    for property in EffectiveProperties(type: type.manifest()) {
      match property.reflectionProperty().get(value) {
        None {}
        Some as present {
          fields.add(property.name + ': ' + DescribeValue(value: present.value, depth: evaluable.depth + 1))
        }
      }
    }

    if fields.size == 0 {
      return type.name + ' {}'
    }

    return type.name + ' { ' + Join(parts: fields, separator: ', ') + ' }'
  }

  let written = WriteLson(value: value)
  let last = written.get(written.size - 1)

  if last.startsWith('< ') {
    return last.substring(2)
  }

  return last
}

expert function jsonText(evaluable: JsonText): string {
  let output = '"'

  for character in evaluable.text.chars() {
    let escaped = character

    if character == '"' {
      escaped = '\\\\"'
    }

    if character == '\\\\' {
      escaped = '\\\\\\\\'
    }

    if character == '\\n' {
      escaped = '\\\\n'
    }

    if character == '\\t' {
      escaped = '\\\\t'
    }

    output = output + escaped
  }

  return output + '"'
}

expert function jsonList(evaluable: JsonList): string {
  return '[' + Join(parts: evaluable.items, separator: ',') + ']'
}
`;var De=`%lson 0.1
%model autocomplete:reflect
< DescribeModels { ids: $args }
`;var we="work";function Ce(l){let e={};for(let[r,s]of Object.entries(l))e[`${we}/${r}`]=s;return e}async function Le(l,e,r){let s=r?Object.entries(e).filter(([a])=>a.endsWith(".lps")):[],_=[...Object.entries(pe(l.tree,"lib")).filter(([a])=>a.endsWith(".lps")).map(([,a])=>a),...s.map(([,a])=>a)],t=Object.fromEntries(s),n=_.some(a=>(0,T.modelIds)(a).includes(T.REFLECT_MODEL));n||(t[`${T.REFLECT_PREFIX}reflect.lps`]=Ae),t[`${T.REFLECT_PREFIX}reflect.lson`]=De;let i=[...new Set(_.flatMap(T.modelIds))],o=await Re(l,[`${K}/${we}/${T.REFLECT_PREFIX}reflect.lson`,...i],{files:Ce(t)});return o.exitCode!==0?{ok:!1,error:(0,T.parseError)(o.stderr||o.stdout)}:{ok:!0,records:(0,T.parseRecords)(o.stdout,{own:n})}}async function Ue(l,e){let r=await Le(l,e,!0);if(r.ok)return{records:r.records,error:null,partial:!1};let s=await Le(l,e,!1);return{records:s.ok?s.records:null,error:r.error,partial:!0}}function Fe(l,e,r,s,{stdin:_="",onStdout:t,onStderr:n}={}){return Re(l,[`${K}/${we}/${r}`,...s],{files:Ce(e),stdin:_,onStdout:t,onStderr:n})}function Pe(l){let e={};for(let r of Object.keys(l.tree.commands||{})){let s=pe(l.tree,`commands/${r}`);s[`${r}.lson`]!==void 0&&(e[r]=s)}return e}var Be=null;self.onmessage=async({data:l})=>{let{id:e,op:r}=l;try{l.baseUrl&&(Be=l.baseUrl);let s=await ge(Be),_=performance.now(),t;if(r==="init")t={commands:Pe(s)};else if(r==="describe")t=await Ue(s,l.files);else if(r==="run")t=await Fe(s,l.files,l.entry,l.args,{stdin:l.stdin,onStdout:n=>self.postMessage({id:e,chunk:n,stream:"stdout"}),onStderr:n=>self.postMessage({id:e,chunk:n,stream:"stderr"})});else throw new Error(`unknown op ${r}`);self.postMessage({id:e,result:{...t,ms:Math.round(performance.now()-_)}})}catch(s){self.postMessage({id:e,error:String(s?.stack||s)})}};
