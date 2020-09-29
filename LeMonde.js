////////////////////////////////////////////////////////
console.log("Hello Mont!");
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
    button.onclick = justGou;
    document.body.appendChild(button);  
}
////////////////////////////////////////////////////////
function justGou() {
    console.log("just Gou");
    for (let j = 0; j < TANKZ; j++) {
        CAP.push((Id("cap" + j).value));
        CON.push((Id("con" + j).value));
    }
    dump();
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
        this.par  = par; // parent tanks
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
/** */
function consTanks() {
    var bf = [];
    for (let j = 0; j < TANKZ; j++) {
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
/** forward search */
function LeMonde(tk) {
    var n = tk.length; /* number of tanks */
    if (n == 2) {
        var T = redux(tk[0], tk[1]);
        if (T.days >= DAYS) {
            STK.push(T);
        }
    } else {
        var bf = backtrack(n + oddq(n)); // pairings
        for (const ps of bf) {
            LeMonde(gredux(tk, ps));
        }       
    }
}
////////        ))))))))--------@@@@@@@@........""""""""
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
var Cont;
/** Count template tree nodes. */
function _cont(root) {
    if( root.par.length !== 0 ){
        Cont += 2;
        _cont(root.par[0]);
        _cont(root.par[1]);
    }
}
function cont(root) {
    Cont = 0;
    _cont(root);
    return Cont;
}
////////-------->>>>>>>>::::::::<<<<<<<<========\\\\\\\\
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** */
function fork(T) {
    if( T.par.length === 0 ) return [];
    var R1 = T.cap;
    var r  = T.par[0].con;
    var c  = T.par[1].con;
    var _  = 2* c +r; // minimum S
    var bf = [];
    var R, dR, dS;
    for (let S = _;; S++) {
        R = R1 - r* Math.floor(S /_);
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
var Vzit = 0;
var Root;
var Aux;
/** H A C K I N G Z O N E */
function _forest(root) {
    var bf = fork(root);
    for (const p of bf) {
        let L = root.par[0];
        let R = root.par[1];
        L.cap = p[0];
        R.cap = p[1];
        Vzit += 2;
        if( Vzit == Cont ){
            Aux.push(copy(Root));
        }
        _forest(L);
        _forest(R);
        Vzit -= 2;
    }
}
function forest(root) {
    Root = copy(root);
    Aux = [];
    Cont = cont(root);
    _forest(Root);
    return Aux[0];
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
/** Dump terminal nodes */
function dmp(root) {
    if( root.par.length === 0 ){
        console.log("" + root);
        return;
    }
    dmp(root.par[0]);
    dmp(root.par[1]);
}
////////-------->>>>>>>>````````________''''''''........
////////////////////////////////////////////////////////
/*     *       *       *       *       *       *      */
/** tesT Zøne */
var tezt = () => {
    TANKZ = 3;
    DAYS  = 4;
    CAP   = [5, 7, 8];
    CON   = [1, 1, 2];
    tk    = consTanks();
    LeMonde(tk);
    console.log(STK[0]);
    dmp(STK[0]);
    dmp(forest(STK[0]));
}
var _es_ = () => {
    var a = new Tank(0, 1);         // c
    var b = new Tank(0, 1);         // r
    var c = new Tank(0, 1, [b, a]); // r
    var d = new Tank(0, 2);         // c
    var e = new Tank(0, 1, [c, d]); // r
    e.cap = 8;
    dmp(forest(e));
}
////////````````""""""""********........--------&&&&&&&&
/////////////////////////////////////////////////// log:
// Boom boom
tezt();
