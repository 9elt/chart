const main = document.querySelector("#main");

const graph = [
  { t: 41, p: 0 },
  { t: 35, p: 0 },
  { t: 27, p: 0 },
  { t: 50, p: 0 },
  { t: 65, p: 0 },
  { t: 99, p: 0 },
  { t: 32, p: 0 },
  { t: 79, p: 0 },
  { t: 65, p: 0 },
];

const settings =   {
  svg_viewbox_height: 64,
  perspective: 4,
  circle_radius: 2,
  cloumn_width: 12,
  cloumn_margin: 2,
}

const c_c = (h) => {
  if (h>70) return 'green';
  else if (h>50) return 'yellow';
  else if (h>30) return 'orange';
  else return 'red';
}

const loop = () => {
  graph.forEach(g => {g.p = g.p + (g.t - g.p)/20; g.c = c_c(g.p)});
  main.innerHTML = get_svg_graph(graph, settings);
  requestAnimationFrame(loop);
}

loop();