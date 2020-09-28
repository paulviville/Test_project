export let tetrahedron_off = 
"OFF\n\
\n\
4 4 0 \n\
 0.5  0.5  0.5 \n\
-0.5  0.5 -0.5 \n\
-0.5 -0.5  0.5 \n\
 0.5 -0.5 -0.5 \n\
3 0 1 2 \n\
3 0 3 1 \n\
3 0 2 3 \n\
3 3 2 1 \n\
";

let icosahedron_off =
"OFF\n\
\n\
12 20 0\n\
  0.000  0.000  0.500\n\
  0.447  0.000  0.223\n\
  0.138  0.425  0.223\n\
 -0.361  0.262  0.223\n\
 -0.361 -0.262  0.223\n\
  0.138 -0.425  0.223\n\
  0.361  0.262 -0.223\n\
 -0.138  0.425 -0.223\n\
 -0.447  0.000 -0.223\n\
 -0.138 -0.425 -0.223\n\
  0.361 -0.262 -0.223\n\
  0.000  0.000 -0.500\n\
3 2 0 1\n\
3 3 0 2\n\
3 4 0 3\n\
3 5 0 4\n\
3 1 0 5\n\
3 2 1 6\n\
3 7 2 6\n\
3 3 2 7\n\
3 8 3 7\n\
3 4 3 8\n\
3 9 4 8\n\
3 5 4 9\n\
3 10 5 9\n\
3 6 1 10\n\
3 1 5 10\n\
3 6 11 7\n\
3 7 11 8\n\
3 8 11 9\n\
3 9 11 10\n\
3 10 11 6\n\
";

let octahedron_off = 
"OFF\n\
\n\
6 8 0\n\
 0.0  0.0  0.5\n\
 0.0  0.0 -0.5\n\
 0.0 -0.5  0.0\n\
 0.5  0.0  0.0\n\
 0.0  0.5  0.0\n\
-0.5  0.0  0.0\n\
3 0 2 3\n\
3 0 3 4\n\
3 0 4 5\n\
3 0 5 2\n\
3 1 3 2\n\
3 1 4 3\n\
3 1 5 4\n\
3 1 2 5\n\
";

let dodecahedron_off = 
`OFF

20 12 0
 0.390  0.283  0.631
-0.149  0.458  0.631
-0.482  0.000  0.631
-0.149 -0.458  0.631
 0.390 -0.283  0.631
 0.631  0.458  0.149
 0.241  0.742 -0.149
-0.241  0.742  0.149
-0.631  0.458 -0.149
-0.780  0.000  0.149
-0.631 -0.458 -0.149
-0.241 -0.742  0.149
 0.241 -0.742 -0.149
 0.780  0.000 -0.149
 0.631 -0.458  0.149
 0.149  0.458 -0.631
-0.390  0.283 -0.631
-0.390 -0.283 -0.631
 0.149 -0.458 -0.631
 0.482  0.000 -0.631
5 1 2 3 4 0
5 4 14 13 5 0
5 5 6 7 1 0
5 7 8 9 2 1
5 9 10 11 3 2
5 11 12 14 4 3
5 13 19 15 6 5
5 15 16 8 7 6
5 16 17 10 9 8
5 17 18 12 11 10
5 18 19 13 14 12
5 19 18 17 16 15
`;

let cube_off = `
OFF

8 6 0
-1 -1 -1
1 -1 -1
1 -1 1
-1 -1 1
-1 1 -1
1 1 -1
1 1 1
-1 1 1
4 0 1 2 3
4 3 2 6 7
4 2 1 5 6
4 0 4 5 1
4 0 3 7 4
4 7 6 5 4
`

let grid2x2_off = `
OFF

9 4 0
-0.5 0.5 0
0 0.5 0
0.5 0.5 0
-0.5 0 0
0 0 0.05
0.5 0 0
-0.5 -0.5 0
0 -0.5 0
0.5 -0.5 0
4 0 3 4 1
4 1 4 5 2
4 3 6 7 4
4 4 7 8 5
`