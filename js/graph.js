function get_svg_graph(cols, s = {}) {

  const style = 'svg{height:35rem}.graph-p{stroke-miterlimit:10;stroke-linecap:round;stroke-linejoin:round;stroke:#fff;stroke-width:.05}.graph-front{fill:var(--front)}.graph-side{fill:var(--side)}.graph-top{fill:var(--top)}.graph-line{fill:none;stroke:#282828cf;stroke-miterlimit:10;stroke-width:.5}.blue{--front:#5ab4fd;--side:#369bee;--top:#369bee}.red{--front:#fd625a;--side:#fb3a30;--top:#fb3a30}.orange{--front:#ff8454;--side:#f0703d;--top:#f0703d}.yellow{--front:#ffc354;--side:#f0b13d;--top:#f0b13d}.green{--front:#6ae160;--side:#49cc3e;--top:#49cc3e}';

  const base_settings = {
    svg_viewbox_height: 63,
    perspective: 2,
    circle_radius: 2,
    cloumn_width: 13,
    cloumn_margin: 2,
  };

  s = {...base_settings, ...s};

  const n = cols.length;

  const max_h = s.svg_viewbox_height;
  const persp = s.perspective;

  const sph = s.circle_radius;
  const w = s.cloumn_width;
  const mx = s.cloumn_margin;

  const actual_max_h = max_h - persp - sph/2;
  const vbox_x = (w + (mx * 2)) * n + persp;

  const columns = [];
  const line = [];
  let pp = {};

  cols.forEach((col, i) => {

    const h = col.p * actual_max_h / 100;
    const x = mx + i * (w + mx);
    const mt = max_h - h;
    columns.push(`
      <!-- front -->
      <rect
        class="graph-p graph-front ${col.c}"
        x="${x}"
        y="${mt}"
        width="${w}"
        height="${h}"/>
      <!-- side -->
      <polygon
        class="graph-p graph-side ${col.c}"
        points="
        ${x + w},${mt}
        ${x + w + persp},${mt - persp}
        ${x + w + persp},${max_h - persp}
        ${x + w},${max_h}
        "
      />
      <!-- top -->
      <polygon
        class="graph-p graph-top ${col.c}"
        points="
        ${x},${mt}
        ${x + persp},${mt - persp}
        ${x + w + persp},${mt - persp}
        ${x + w},${mt}
        "
      />
    `);

    //sphere center
    const p = { x: x + (w + mx) / 2, y: mt - persp / 2 };
    //line points distance from center
    let d = sph;
    //vector
    let v = { x: p.x - pp.x, y: p.y - pp.y };
    let v_l = Math.sqrt(v.x ** 2 + v.y ** 2);
    //normalized
    let u = { x: v.x / v_l, y: v.y / v_l };
    //line start and end points
    let st = { x: p.x - u.x * d, y: p.y - u.y * d };
    let end = { x: pp.x + u.x * d, y: pp.y + u.y * d };

    line.push(`
      <circle
        class="graph-line"
        cx="${p.x}"
        cy="${p.y}"
        r="${sph}"
      />
      ${i > 0 && `
      <line
        class="graph-line"
        x1="${st.x}"
        y1="${st.y}"
        x2="${end.x}"
        y2="${end.y}"
      />`}
    `);

    pp = p;
  });

  return `
    <svg x="0px" y="0px" viewBox="0 0 ${vbox_x} ${max_h}"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

      <style>
        ${style}
      </style>

      ${columns}

      ${line}

    </svg>
  `;
}