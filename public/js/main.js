
//http://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
function intersection(x0, y0, r0, x1, y1, r1) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy*dy) + (dx*dx));

    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

    /* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a/d);
    y2 = y0 + (dy * a/d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((r0*r0) - (a*a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h/d);
    ry = dx * (h/d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    return [xi, xi_prime, yi, yi_prime];
}


var LangColor = {
    "Ant": 0x320A28,
    "Assembler": 0x008080,
    "ASP": 0x0000ff,
    "Awk": 0x00ffff,
    "BASIC": 0xeeeeee,
    "BETA": 0x40e0d0,
    "C": 0xffd700,
    "C++": 0xff7373,
    "C#": 0xb0e0e6,
    "COBOL": 0xc0c0c0,
    "DOS Batch": 0x003366,
    "Eiffel": 0xffa500,
    "Erlang": 0x00ff00,
    "Flex": 0xf6546a,
    "Fortran": 0x800080,
    "HTML": 0x468499,
    "Java": 0x660066,
    "JavaScript": 0x800000,
    "Lisp": 0x00ced1,
    "Lua": 0xccff00,
    "Make": 0xff6666,
    "MATLAB": 0x66cccc,
    "Objective Cam": 0xdaa520,
    "Pascal": 0x81d8d0,
    "Perl": 0xc39797,
    "PHP": 0xff4040,
    "PL/SQL": 0xffdab9,
    "Python (Pyrex/Cython)": 0x3b5998,
    "REXX": 0x6897bb,
    "Ruby": 0x191970,
    "Scheme": 0xff4444,
    "Shell scripts (Bourne/Korn/Z)": 0xffff66,
    "S-Lang": 0x4169e1,
    "SML (Standard ML)": 0x04040,
    "Tcl": 0,
    "TeX": 0,
    "Vera": 0,
    "Verilog": 0,
    "VHDL": 0,
    "Vim": 0,
    "YACC": 0
};