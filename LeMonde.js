////////////////////////////////////////////////////////
console.log("Hello LeMonde!");
var TANKZ = 0;  // number of climbers
var DAYS  = 0;  // what is this?
var CAP   = []; // reservoir capacity
var CON   = []; // consumption per day
var STK   = []; // pairwise union
var cons  = locname => document.createElement(locname);
var Id    = str => document.getElementById(str);
////////////////////////////////////////////////////////
function cell(id)
// construct table cell:
// id: cell id
{
    var td     = cons("td");
    var input  = cons("input");
    input.type = "number";
    input.id   = id;
    td.appendChild(input);
    return td;
}
////////////////////////////////////////////////////////
function row(j)
// construct table row:
// j: row index
{
    var tr  = cons("tr");
    var cap = cell("cap" + j);
    var con = cell("con" + j);
    tr.appendChild(cap);
    tr.appendChild(con);
    return tr;
}
////////////////////////////////////////////////////////
function getTanks() {
    TANKZ     = parseInt(Id("tanks").value, 10);
    DAYS      = parseInt(Id("days").value, 10);
    var table = Id("capcon");
    table.style.visibility = "visible";
    for (let j = 0; j < TANKZ; j++) {
        table.appendChild(row(j));
    }
    document.body.appendChild(table);
    ////////////////////////////////////////////////////
    var button     = cons("input");
    button.type    = "button";
    button.value   = "Gou";
    button.onclick = JustGou;
    document.body.appendChild(button);  
}
////////////////////////////////////////////////////////
function JustGou() {
    DAYS = parseInt(Id("days").value, 10);
    for (let j = 0; j < TANKZ; j++) {
        CAP[j] = parseInt(Id("cap" + j).value);
        CON[j] = parseInt(Id("con" + j).value);
    }
    dump();
    wtf2();
}
////////////////////////////////////////////////////////
var dump = () => {
    var str = ("Tanks: " + TANKZ +
               "\nDays: " + DAYS +
               "\nCap: " + CAP +
               "\nCon: " + CON);
    console.log(str);
}
////////--------````````>>>>>>>>________!!!!!!!!========
/*     *       *       *       *       *       *      */
class Tank {
    constructor(cap, con, par = []) {
        this.cap  = cap;
        this.con  = con;
        this.days = cap/ con;
        this.par  = par;
        this.stk  = [];
        this.car  = cap; // backup
    }
    toString() {
        return ("( " + this.cap +
                ", " + this.con + " )");
    }
}
////////////////////////////////////////////////////////
////////>>>>>>>>********--------````````%%%%%%%%88888888
/*     *       *       *       *       *       *      */
/** Get Index List: return bit position list.
  * @param {number} s - subset
  */
function getIndxList(s) {
    var ls = [];
    for (let pos = 0; s; pos++, s >>= 1) {
        if (s & 1) ls.push(pos);
    }
    return ls;
}
////////////////////////////////////////////////////////
////////--------<<<<<<<<________````````<<<<<<<<========
/*     *       *       *       *       *       *      */
/** Generate Tank Groups                              */
function genTankGrps() {
    var maxGrpz = 1 << TANKZ; //        > max nof groups
    bf = [];
    for (let s = 0; s < maxGrpz; s++) {
        let ls = getIndxList(s);
        if (ls.length > 1) {
            bf.push(ls);
        }
    }
    return bf;
}
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** odd? even? */
var oddq = x => Boolean(x %2);
var evnq = x => !oddq(x);
////////--------''''''''________********""""""""========
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** Domain minimum */
function minD(l, x) {
    return (x[l- 1 -evnq(l)] + 1);
}
////////________''''''''--------\\\\\\\\>>>>>>>>,,,,,,,,
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** Domain maximum */
function maxD(l, x) {
    if (oddq(l)) return (x.length - 1);
    return l;
}
////////-------->>>>>>>>''''''''********,,,,,,,,))))))))
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** */
function backtrack(n) {
    B1: // init
    (x = []).length = n;
    (c = []).length = n;
    x[0] = -1;
    c.fill(0);
    l = 0;
    bf = [];
    B5: // backtrack
    do {
        B4: // try again
        while (x[l] < maxD(l, x)) {
            x[l]++;
            B3: // try
            while (!c[x[l]]) {
                c[x[l]] = 1;
                l++;
                B2: // enta levl
                if (l == n) {
                    bf.push(x.slice());
                    break B4;
                }
                x[l] = minD(l, x);
            }
        }
        l--;
        c[x[l]] = 0;
    } while(l);
    return bf;
}
////////========        >>>>>>>>^^^^^^^^________````````
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** + idx: index list
  * - genTankGrps
  */
function ConsTanks(idx) {
    var bf = []; // buffer
    for (const j of idx) {
        bf.push(new Tank(CAP[j], CON[j]));
    }
    return bf;
}
////////-------->>>>>>>><<<<<<<<========\\\\\\\\;;;;;;;;
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** */
function runner(Ti, Tj) {
    return (Ti.days < Tj.days)? Tj :Ti;
}
function carrier(Ti, Tj) {
    return (Ti.days < Tj.days) ?Ti: Tj;
}
////////-------->>>>>>>>========````````!!!!!!!!22222222
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** runner-carrier reduction */
function redux(Ti, Tj) {
    var Tr =  runner(Ti, Tj);
    var Tc = carrier(Ti, Tj);
    var S  = Tc.cap;
    var  c = Tc.con;
    var R  = Tr.cap;
    var r  = Tr.con;
    var R1 = R +r* Math.floor(S/ (2 *c +r));
    return new Tank(R1, r, [Tr, Tc]);
}
////////********````````________-------->>>>>>>>........
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** Group Reduction
  * tk - Tanks (can be odd)
  * ps - pairs (even list)
  */
function gredux(tk, ps) {
    var bf = [];
    for (let k = 0; k < ps.length; k += 2) {
        let i = ps[k];
        let j = ps[k + 1];
        if (j == tk.length) { // Empty slot (odd tanks)
            bf.push(tk[i]);
        } else {
            bf.push(redux(tk[i], tk[j]));
        }
    }
    return bf;
}
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** forward search
  * tk - tank list
  * Ok, backtrack iiz generating all tk pairings and
  * gredux and redux are reducing each pair to a single
  * tank, vhich iz a tree process, than the last tank is
  * checked vhether it is capable to cross the goal line
  * Here all units are at full capacity. Than if there
  * is a solution, this tree is used as a template and
  * forest procedure is searching for minimum total
  * capacity (plz ignore any bugs coz there are lot).
  */
function LeMonde(tk) {
    var n = tk.length; /* number of tanks */
    if (n === 2) {
        var T = redux(tk[0], tk[1]);
        if( T.days >= DAYS<< 1 ){ STK.push(T); }}
    else {
        n += oddq(n);
        for (const ps of backtrack(n)) {
            LeMonde(gredux(tk, ps));
        }}}
////////        ))))))))--------@@@@@@@@........""""""""
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
var Term = [];
/** get terminal nodes */
function _getterm_(root)
////////--------''''''''________========"""""""">>>>>>>>
{
    if( root.par.length === 0 ){
        Term.push(root);
    } else {
        _getterm_(root.par[0]);
        _getterm_(root.par[1]);
    }
}
function getterm(root)
////////********________''''''''========>>>>>>>>""""""""
{
    Term.length = 0;     //              > clear
    _getterm_(root);     //              > fill Term
    return Term.slice(); //              > return a copy
}
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** dump terminal nodes */
function dmpterm(term)
////////-------->>>>>>>>````````________''''''''........
{   var str = '';
    for (const n of term) {
        str += (n + ' ');
    }
    console.log(str);
}
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** get total group capacity */
function gettotal(term)
////////-------->>>>>>>>::::::::<<<<<<<<========\\\\\\\\
{   var total = 0;
    for (const n of term) {
        total += n.cap;
    }
    return total;
}
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** */
function fork(T) {
    var R1 = T.cap;
    var r  = T.par[0].con;
    var c  = T.par[1].con;
    var _  = 2* c +r; // minimum S
    var bf = [];
    var R, dR, dS;
    for (let S = _;; S++) {
        R = R1 - r* Math.floor(S /_);
        if( R > T.par[0].car ){ continue; } // :)
        dR = R/ r;
        dS = S /c;
        if (dS > dR) break;
        bf.push([R, S]);
    }
    return bf;
}
////////________````````========>>>>>>>>''''''''""""""""
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** H A C K I N G Z O N E */
var Overflow = false;
function forest(T) {
    if( T.par.length === 0 ){ // <<neva use evil twins""
        return; /* Terminal nodè */
    }
    if( T.stk.length === 0 ){ // empty2
        T.stk = fork(T);
        if( T.stk.length === 0 ){ 
            Overflow = true;
            return;
        }
    }
    var R = T.par[0]; // Parent Runner
    var C = T.par[1]; // Parent Carrier
    if( R.stk.length === 0 && C.stk.length === 0 ){
        let p = T.stk.shift();
        R.cap = p[0];
        C.cap = p[1];
    }
    forest(R);
    forest(C);
}
var hack = T => {
    do {
        Overflow = false;
        forest(T);
    } while (Overflow);
}
////////========********////////________````````''''''''
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** Copy Ninja Kakashi Sensej */
function copy(root) {
    var p = new Tank(root.cap, root.con);
    if( root.par.length !== 0 ){
        p.par = [copy(root.par[0]),
                 copy(root.par[1])];
    }
    return p;
}
////////%%%%%%%%????????%%%%%%%%||||||||00000000--------
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** tesT Zøne */
var ck = idx => {
    var tk = ConsTanks(idx);
    STK.length = 0;
    LeMonde(tk);
    for (let j = 0; j < STK.length; j++) {
        // target capacity
        let tar = 2 *DAYS* STK[j].con;
        let cp = geropt(STK[j], tar);
        if( cp.cap === tar ){ return cp; }
    }
    return -1;
}
var geropt = (T, tar) => {
    var cp   = copy(T);
    var orig = cp.cap; // backup
    for (let cap = tar; cap <= orig; cap++) {
        cp.cap = cap;
        hack(cp);
        if( Overflow === false ) break;
    }
    return cp;    
}
////////````````""""""""********........--------&&&&&&&&
/////////////////////////////////////////////////// log:
// > @fork: { bug #f012 }
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** - Ö W-H-AT-THE-F-A-A-A-A-A-A-A-A-A-K2
  */
var wtf2 = () => {
    var bf = genTankGrps(); // index subsets
    var grp;
    var mtotal = Infinity; //            > minimum total
    var mtanks = Infinity; //            > minimum tanks
    var mgrp   = null;     //            > :)
    var midx   = [];       //            > yeah!
    var mterm  = [];       //            > wow?
    for (const idx of bf) {
        console.log(idx);
        if(( grp = ck(idx)) === -1 ){
            console.log(':)'); }
        else {
            let term = getterm(grp),
                total = gettotal(term);
            if( total <= mtotal &&
                term.length < mtanks ){
                mtotal = total;
                mtanks = term.length;
                mgrp = grp;
                midx = idx;
                mterm = term;
            }
            dmpterm(term);
            console.log(total);
        }}
    console.log("BHuMaHue:");
    console.log(midx);
    console.log(mgrp);
    dmpterm(mterm);
}
////////========________>>>>>>>>````````,,,,,,,,////////
