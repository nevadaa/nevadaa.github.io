!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports)
    : "function" == typeof define && define.amd
      ? define(["exports"], e)
      : e(
          ((t =
            "undefined" != typeof globalThis ? globalThis : t || self).pako =
            {}),
        );
})(this, function (t) {
  "use strict";
  function e(t) {
    let e = t.length;
    for (; 0 <= --e; ) t[e] = 0;
  }
  var l = 256,
    s = 286,
    o = 30,
    m = 15,
    h = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5,
      5, 5, 5, 0,
    ]),
    d = new Uint8Array([
      0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
      11, 11, 12, 12, 13, 13,
    ]),
    _ = new Uint8Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7,
    ]),
    f = new Uint8Array([
      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
    ]);
  const u = new Array(576);
  e(u);
  const c = new Array(60);
  e(c);
  const w = new Array(512);
  e(w);
  const b = new Array(256);
  e(b);
  const g = new Array(29);
  e(g);
  const p = new Array(o);
  function k(t, e, a, i, n) {
    (this.static_tree = t),
      (this.extra_bits = e),
      (this.extra_base = a),
      (this.elems = i),
      (this.max_length = n),
      (this.has_stree = t && t.length);
  }
  e(p);
  let v, y, x;
  function a(t, e) {
    (this.dyn_tree = t), (this.max_code = 0), (this.stat_desc = e);
  }
  var z = (t) => (t < 256 ? w[t] : w[256 + (t >>> 7)]),
    n = (t, e) => {
      (t.pending_buf[t.pending++] = 255 & e),
        (t.pending_buf[t.pending++] = (e >>> 8) & 255);
    },
    A = (t, e, a) => {
      t.bi_valid > 16 - a
        ? ((t.bi_buf |= (e << t.bi_valid) & 65535),
          n(t, t.bi_buf),
          (t.bi_buf = e >> (16 - t.bi_valid)),
          (t.bi_valid += a - 16))
        : ((t.bi_buf |= (e << t.bi_valid) & 65535), (t.bi_valid += a));
    },
    E = (t, e, a) => {
      A(t, a[2 * e], a[2 * e + 1]);
    },
    R = (t, e) => {
      let a = 0;
      for (; (a |= 1 & t), (t >>>= 1), (a <<= 1), 0 < --e; );
      return a >>> 1;
    },
    Z = (t, e, a) => {
      const i = new Array(16);
      let n = 0,
        r,
        s;
      for (r = 1; r <= m; r++) (n = (n + a[r - 1]) << 1), (i[r] = n);
      for (s = 0; s <= e; s++) {
        var o = t[2 * s + 1];
        0 !== o && (t[2 * s] = R(i[o]++, o));
      }
    },
    U = (t) => {
      let e;
      for (e = 0; e < s; e++) t.dyn_ltree[2 * e] = 0;
      for (e = 0; e < o; e++) t.dyn_dtree[2 * e] = 0;
      for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
      (t.dyn_ltree[512] = 1),
        (t.opt_len = t.static_len = 0),
        (t.sym_next = t.matches = 0);
    },
    S = (t) => {
      8 < t.bi_valid
        ? n(t, t.bi_buf)
        : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf),
        (t.bi_buf = 0),
        (t.bi_valid = 0);
    },
    r = (t, e, a, i) => {
      var n = 2 * e,
        r = 2 * a;
      return t[n] < t[r] || (t[n] === t[r] && i[e] <= i[a]);
    },
    D = (t, e, a) => {
      var i = t.heap[a];
      let n = a << 1;
      for (
        ;
        n <= t.heap_len &&
        (n < t.heap_len && r(e, t.heap[n + 1], t.heap[n], t.depth) && n++,
        !r(e, i, t.heap[n], t.depth));

      )
        (t.heap[a] = t.heap[n]), (a = n), (n <<= 1);
      t.heap[a] = i;
    },
    T = (t, e, a) => {
      let i,
        n,
        r = 0,
        s,
        o;
      if (0 !== t.sym_next)
        for (
          ;
          (i = 255 & t.pending_buf[t.sym_buf + r++]),
            (i += (255 & t.pending_buf[t.sym_buf + r++]) << 8),
            (n = t.pending_buf[t.sym_buf + r++]),
            0 === i
              ? E(t, n, e)
              : ((s = b[n]),
                E(t, s + l + 1, e),
                (o = h[s]),
                0 !== o && ((n -= g[s]), A(t, n, o)),
                i--,
                (s = z(i)),
                E(t, s, a),
                (o = d[s]),
                0 !== o && ((i -= p[s]), A(t, i, o))),
            r < t.sym_next;

        );
      E(t, 256, e);
    },
    O = (t, e) => {
      const a = e.dyn_tree;
      var i = e.stat_desc.static_tree,
        n = e.stat_desc.has_stree,
        r = e.stat_desc.elems;
      let s,
        o,
        l = -1,
        h;
      for (t.heap_len = 0, t.heap_max = 573, s = 0; s < r; s++)
        0 !== a[2 * s]
          ? ((t.heap[++t.heap_len] = l = s), (t.depth[s] = 0))
          : (a[2 * s + 1] = 0);
      for (; t.heap_len < 2; )
        (h = t.heap[++t.heap_len] = l < 2 ? ++l : 0),
          (a[2 * h] = 1),
          (t.depth[h] = 0),
          t.opt_len--,
          n && (t.static_len -= i[2 * h + 1]);
      for (e.max_code = l, s = t.heap_len >> 1; 1 <= s; s--) D(t, a, s);
      for (
        h = r;
        (s = t.heap[1]),
          (t.heap[1] = t.heap[t.heap_len--]),
          D(t, a, 1),
          (o = t.heap[1]),
          (t.heap[--t.heap_max] = s),
          (t.heap[--t.heap_max] = o),
          (a[2 * h] = a[2 * s] + a[2 * o]),
          (t.depth[h] =
            (t.depth[s] >= t.depth[o] ? t.depth[s] : t.depth[o]) + 1),
          (a[2 * s + 1] = a[2 * o + 1] = h),
          (t.heap[1] = h++),
          D(t, a, 1),
          2 <= t.heap_len;

      );
      (t.heap[--t.heap_max] = t.heap[1]),
        ((t, e) => {
          const a = e.dyn_tree;
          var i = e.max_code,
            n = e.stat_desc.static_tree,
            r = e.stat_desc.has_stree,
            s = e.stat_desc.extra_bits,
            o = e.stat_desc.extra_base,
            l = e.stat_desc.max_length;
          let h,
            d,
            _,
            f,
            u,
            c,
            w = 0;
          for (f = 0; f <= m; f++) t.bl_count[f] = 0;
          for (
            a[2 * t.heap[t.heap_max] + 1] = 0, h = t.heap_max + 1;
            h < 573;
            h++
          )
            (d = t.heap[h]),
              (f = a[2 * a[2 * d + 1] + 1] + 1),
              f > l && ((f = l), w++),
              (a[2 * d + 1] = f),
              d > i ||
                (t.bl_count[f]++,
                (u = 0),
                d >= o && (u = s[d - o]),
                (c = a[2 * d]),
                (t.opt_len += c * (f + u)),
                r && (t.static_len += c * (n[2 * d + 1] + u)));
          if (0 !== w) {
            do {
              for (f = l - 1; 0 === t.bl_count[f]; ) f--;
            } while (
              (t.bl_count[f]--,
              (t.bl_count[f + 1] += 2),
              t.bl_count[l]--,
              (w -= 2),
              0 < w)
            );
            for (f = l; 0 !== f; f--)
              for (d = t.bl_count[f]; 0 !== d; )
                (_ = t.heap[--h]),
                  _ > i ||
                    (a[2 * _ + 1] !== f &&
                      ((t.opt_len += (f - a[2 * _ + 1]) * a[2 * _]),
                      (a[2 * _ + 1] = f)),
                    d--);
          }
        })(t, e),
        Z(a, l, t.bl_count);
    },
    I = (t, e, a) => {
      let i,
        n = -1,
        r,
        s = e[1],
        o = 0,
        l = 7,
        h = 4;
      for (
        0 === s && ((l = 138), (h = 3)), e[2 * (a + 1) + 1] = 65535, i = 0;
        i <= a;
        i++
      )
        (r = s),
          (s = e[2 * (i + 1) + 1]),
          (++o < l && r === s) ||
            (o < h
              ? (t.bl_tree[2 * r] += o)
              : 0 !== r
                ? (r !== n && t.bl_tree[2 * r]++, t.bl_tree[32]++)
                : o <= 10
                  ? t.bl_tree[34]++
                  : t.bl_tree[36]++,
            (o = 0),
            (n = r),
            (h =
              0 === s
                ? ((l = 138), 3)
                : r === s
                  ? ((l = 6), 3)
                  : ((l = 7), 4)));
    },
    F = (t, e, a) => {
      let i,
        n = -1,
        r,
        s = e[1],
        o = 0,
        l = 7,
        h = 4;
      for (0 === s && ((l = 138), (h = 3)), i = 0; i <= a; i++)
        if (((r = s), (s = e[2 * (i + 1) + 1]), !(++o < l && r === s))) {
          if (o < h) for (; E(t, r, t.bl_tree), 0 != --o; );
          else
            0 !== r
              ? (r !== n && (E(t, r, t.bl_tree), o--),
                E(t, 16, t.bl_tree),
                A(t, o - 3, 2))
              : o <= 10
                ? (E(t, 17, t.bl_tree), A(t, o - 3, 3))
                : (E(t, 18, t.bl_tree), A(t, o - 11, 7));
          (o = 0),
            (n = r),
            (h =
              0 === s ? ((l = 138), 3) : r === s ? ((l = 6), 3) : ((l = 7), 4));
        }
    };
  let i = !1;
  var L = (t, e, a, i) => {
      A(t, 0 + (i ? 1 : 0), 3),
        S(t),
        n(t, a),
        n(t, ~a),
        a && t.pending_buf.set(t.window.subarray(e, e + a), t.pending),
        (t.pending += a);
    },
    N = {
      _tr_init: (t) => {
        i ||
          ((() => {
            let t, e, a, i, n;
            const r = new Array(16);
            for (a = 0, i = 0; i < 28; i++)
              for (g[i] = a, t = 0; t < 1 << h[i]; t++) b[a++] = i;
            for (b[a - 1] = i, n = 0, i = 0; i < 16; i++)
              for (p[i] = n, t = 0; t < 1 << d[i]; t++) w[n++] = i;
            for (n >>= 7; i < o; i++)
              for (p[i] = n << 7, t = 0; t < 1 << (d[i] - 7); t++)
                w[256 + n++] = i;
            for (e = 0; e <= m; e++) r[e] = 0;
            for (t = 0; t <= 143; ) (u[2 * t + 1] = 8), t++, r[8]++;
            for (; t <= 255; ) (u[2 * t + 1] = 9), t++, r[9]++;
            for (; t <= 279; ) (u[2 * t + 1] = 7), t++, r[7]++;
            for (; t <= 287; ) (u[2 * t + 1] = 8), t++, r[8]++;
            for (Z(u, 287, r), t = 0; t < o; t++)
              (c[2 * t + 1] = 5), (c[2 * t] = R(t, 5));
            (v = new k(u, h, 257, s, m)),
              (y = new k(c, d, 0, o, m)),
              (x = new k(new Array(0), _, 0, 19, 7));
          })(),
          (i = !0)),
          (t.l_desc = new a(t.dyn_ltree, v)),
          (t.d_desc = new a(t.dyn_dtree, y)),
          (t.bl_desc = new a(t.bl_tree, x)),
          (t.bi_buf = 0),
          (t.bi_valid = 0),
          U(t);
      },
      _tr_stored_block: L,
      _tr_flush_block: (t, e, a, i) => {
        let n,
          r,
          s = 0;
        0 < t.level
          ? (2 === t.strm.data_type &&
              (t.strm.data_type = ((t) => {
                let e = 4093624447,
                  a;
                for (a = 0; a <= 31; a++, e >>>= 1)
                  if (1 & e && 0 !== t.dyn_ltree[2 * a]) return 0;
                if (
                  0 !== t.dyn_ltree[18] ||
                  0 !== t.dyn_ltree[20] ||
                  0 !== t.dyn_ltree[26]
                )
                  return 1;
                for (a = 32; a < l; a++) if (0 !== t.dyn_ltree[2 * a]) return 1;
                return 0;
              })(t)),
            O(t, t.l_desc),
            O(t, t.d_desc),
            (s = ((t) => {
              let e;
              for (
                I(t, t.dyn_ltree, t.l_desc.max_code),
                  I(t, t.dyn_dtree, t.d_desc.max_code),
                  O(t, t.bl_desc),
                  e = 18;
                3 <= e && 0 === t.bl_tree[2 * f[e] + 1];
                e--
              );
              return (t.opt_len += 3 * (e + 1) + 5 + 5 + 4), e;
            })(t)),
            (n = (t.opt_len + 3 + 7) >>> 3),
            (r = (t.static_len + 3 + 7) >>> 3),
            r <= n && (n = r))
          : (n = r = a + 5),
          a + 4 <= n && -1 !== e
            ? L(t, e, a, i)
            : 4 === t.strategy || r === n
              ? (A(t, 2 + (i ? 1 : 0), 3), T(t, u, c))
              : (A(t, 4 + (i ? 1 : 0), 3),
                ((t, e, a, i) => {
                  let n;
                  for (
                    A(t, e - 257, 5), A(t, a - 1, 5), A(t, i - 4, 4), n = 0;
                    n < i;
                    n++
                  )
                    A(t, t.bl_tree[2 * f[n] + 1], 3);
                  F(t, t.dyn_ltree, e - 1), F(t, t.dyn_dtree, a - 1);
                })(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1),
                T(t, t.dyn_ltree, t.dyn_dtree)),
          U(t),
          i && S(t);
      },
      _tr_tally: (t, e, a) => (
        (t.pending_buf[t.sym_buf + t.sym_next++] = e),
        (t.pending_buf[t.sym_buf + t.sym_next++] = e >> 8),
        (t.pending_buf[t.sym_buf + t.sym_next++] = a),
        0 === e
          ? t.dyn_ltree[2 * a]++
          : (t.matches++,
            e--,
            t.dyn_ltree[2 * (b[a] + l + 1)]++,
            t.dyn_dtree[2 * z(e)]++),
        t.sym_next === t.sym_end
      ),
      _tr_align: (t) => {
        A(t, 2, 3),
          E(t, 256, u),
          16 === (t = t).bi_valid
            ? (n(t, t.bi_buf), (t.bi_buf = 0), (t.bi_valid = 0))
            : 8 <= t.bi_valid &&
              ((t.pending_buf[t.pending++] = 255 & t.bi_buf),
              (t.bi_buf >>= 8),
              (t.bi_valid -= 8));
      },
    },
    B = (t, e, a, i) => {
      let n = (65535 & t) | 0,
        r = ((t >>> 16) & 65535) | 0,
        s = 0;
      for (; 0 !== a; ) {
        for (
          s = 2e3 < a ? 2e3 : a, a -= s;
          (n = (n + e[i++]) | 0), (r = (r + n) | 0), --s;

        );
        (n %= 65521), (r %= 65521);
      }
      return n | (r << 16) | 0;
    },
    C = new Uint32Array(
      (() => {
        let t,
          e = [];
        for (var a = 0; a < 256; a++) {
          t = a;
          for (var i = 0; i < 8; i++)
            t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
          e[a] = t;
        }
        return e;
      })(),
    ),
    M = (e, a, t, i) => {
      var n = C,
        r = i + t;
      e ^= -1;
      for (let t = i; t < r; t++) e = (e >>> 8) ^ n[255 & (e ^ a[t])];
      return -1 ^ e;
    },
    H = {
      2: "need dictionary",
      1: "stream end",
      0: "",
      "-1": "file error",
      "-2": "stream error",
      "-3": "data error",
      "-4": "insufficient memory",
      "-5": "buffer error",
      "-6": "incompatible version",
    },
    j = {
      Z_NO_FLUSH: 0,
      Z_PARTIAL_FLUSH: 1,
      Z_SYNC_FLUSH: 2,
      Z_FULL_FLUSH: 3,
      Z_FINISH: 4,
      Z_BLOCK: 5,
      Z_TREES: 6,
      Z_OK: 0,
      Z_STREAM_END: 1,
      Z_NEED_DICT: 2,
      Z_ERRNO: -1,
      Z_STREAM_ERROR: -2,
      Z_DATA_ERROR: -3,
      Z_MEM_ERROR: -4,
      Z_BUF_ERROR: -5,
      Z_NO_COMPRESSION: 0,
      Z_BEST_SPEED: 1,
      Z_BEST_COMPRESSION: 9,
      Z_DEFAULT_COMPRESSION: -1,
      Z_FILTERED: 1,
      Z_HUFFMAN_ONLY: 2,
      Z_RLE: 3,
      Z_FIXED: 4,
      Z_DEFAULT_STRATEGY: 0,
      Z_BINARY: 0,
      Z_TEXT: 1,
      Z_UNKNOWN: 2,
      Z_DEFLATED: 8,
    };
  const {
    _tr_init: K,
    _tr_stored_block: P,
    _tr_flush_block: Y,
    _tr_tally: G,
    _tr_align: X,
  } = N;
  var {
      Z_NO_FLUSH: W,
      Z_PARTIAL_FLUSH: q,
      Z_FULL_FLUSH: J,
      Z_FINISH: Q,
      Z_BLOCK: V,
      Z_OK: $,
      Z_STREAM_END: tt,
      Z_STREAM_ERROR: et,
      Z_DATA_ERROR: at,
      Z_BUF_ERROR: it,
      Z_DEFAULT_COMPRESSION: nt,
      Z_FILTERED: rt,
      Z_HUFFMAN_ONLY: st,
      Z_RLE: ot,
      Z_FIXED: lt,
      Z_DEFAULT_STRATEGY: ht,
      Z_UNKNOWN: dt,
      Z_DEFLATED: _t,
    } = j,
    ft = 258,
    ut = 262,
    ct = (t, e) => ((t.msg = H[e]), e),
    wt = (t) => 2 * t - (4 < t ? 9 : 0),
    mt = (t) => {
      let e = t.length;
      for (; 0 <= --e; ) t[e] = 0;
    };
  let bt = (t, e, a) => ((e << t.hash_shift) ^ a) & t.hash_mask;
  var gt = (t) => {
      const e = t.state;
      let a = e.pending;
      a > t.avail_out && (a = t.avail_out),
        0 !== a &&
          (t.output.set(
            e.pending_buf.subarray(e.pending_out, e.pending_out + a),
            t.next_out,
          ),
          (t.next_out += a),
          (e.pending_out += a),
          (t.total_out += a),
          (t.avail_out -= a),
          (e.pending -= a),
          0 === e.pending && (e.pending_out = 0));
    },
    pt = (t, e) => {
      Y(
        t,
        0 <= t.block_start ? t.block_start : -1,
        t.strstart - t.block_start,
        e,
      ),
        (t.block_start = t.strstart),
        gt(t.strm);
    },
    kt = (t, e) => {
      t.pending_buf[t.pending++] = e;
    },
    vt = (t, e) => {
      (t.pending_buf[t.pending++] = (e >>> 8) & 255),
        (t.pending_buf[t.pending++] = 255 & e);
    },
    yt = (t, e, a, i) => {
      let n = t.avail_in;
      return (
        n > i && (n = i),
        0 === n
          ? 0
          : ((t.avail_in -= n),
            e.set(t.input.subarray(t.next_in, t.next_in + n), a),
            1 === t.state.wrap
              ? (t.adler = B(t.adler, e, n, a))
              : 2 === t.state.wrap && (t.adler = M(t.adler, e, n, a)),
            (t.next_in += n),
            (t.total_in += n),
            n)
      );
    },
    xt = (t, e) => {
      let a = t.max_chain_length,
        i = t.strstart,
        n,
        r,
        s = t.prev_length,
        o = t.nice_match;
      var l = t.strstart > t.w_size - ut ? t.strstart - (t.w_size - ut) : 0,
        h = t.window,
        d = t.w_mask,
        _ = t.prev,
        f = t.strstart + ft;
      let u = h[i + s - 1],
        c = h[i + s];
      t.prev_length >= t.good_match && (a >>= 2),
        o > t.lookahead && (o = t.lookahead);
      do {
        if (
          ((n = e),
          h[n + s] === c &&
            h[n + s - 1] === u &&
            h[n] === h[i] &&
            h[++n] === h[i + 1])
        ) {
          for (
            i += 2, n++;
            h[++i] === h[++n] &&
            h[++i] === h[++n] &&
            h[++i] === h[++n] &&
            h[++i] === h[++n] &&
            h[++i] === h[++n] &&
            h[++i] === h[++n] &&
            h[++i] === h[++n] &&
            h[++i] === h[++n] &&
            i < f;

          );
          if (((r = ft - (f - i)), (i = f - ft), r > s)) {
            if (((t.match_start = e), (s = r), r >= o)) break;
            (u = h[i + s - 1]), (c = h[i + s]);
          }
        }
      } while ((e = _[e & d]) > l && 0 != --a);
      return s <= t.lookahead ? s : t.lookahead;
    },
    zt = (t) => {
      var e = t.w_size;
      let a, i, n;
      do {
        if (
          ((i = t.window_size - t.lookahead - t.strstart),
          t.strstart >= e + (e - ut) &&
            (t.window.set(t.window.subarray(e, e + e - i), 0),
            (t.match_start -= e),
            (t.strstart -= e),
            (t.block_start -= e),
            t.insert > t.strstart && (t.insert = t.strstart),
            ((t) => {
              let e, a, i;
              var n = t.w_size;
              for (
                e = t.hash_size, i = e;
                (a = t.head[--i]), (t.head[i] = a >= n ? a - n : 0), --e;

              );
              for (
                e = n, i = e;
                (a = t.prev[--i]), (t.prev[i] = a >= n ? a - n : 0), --e;

              );
            })(t),
            (i += e)),
          0 === t.strm.avail_in)
        )
          break;
        if (
          ((a = yt(t.strm, t.window, t.strstart + t.lookahead, i)),
          (t.lookahead += a),
          3 <= t.lookahead + t.insert)
        )
          for (
            n = t.strstart - t.insert,
              t.ins_h = t.window[n],
              t.ins_h = bt(t, t.ins_h, t.window[n + 1]);
            t.insert &&
            ((t.ins_h = bt(t, t.ins_h, t.window[n + 3 - 1])),
            (t.prev[n & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = n),
            n++,
            t.insert--,
            !(t.lookahead + t.insert < 3));

          );
      } while (t.lookahead < ut && 0 !== t.strm.avail_in);
    },
    At = (t, e) => {
      let a =
          t.pending_buf_size - 5 > t.w_size ? t.w_size : t.pending_buf_size - 5,
        i,
        n,
        r,
        s = 0;
      for (
        var o = t.strm.avail_in;
        (i = 65535),
          (r = (t.bi_valid + 42) >> 3),
          !(
            t.strm.avail_out < r ||
            ((r = t.strm.avail_out - r),
            (n = t.strstart - t.block_start),
            i > n + t.strm.avail_in && (i = n + t.strm.avail_in),
            i > r && (i = r),
            (i < a &&
              ((0 === i && e !== Q) || e === W || i !== n + t.strm.avail_in)) ||
              ((s = e === Q && i === n + t.strm.avail_in ? 1 : 0),
              P(t, 0, 0, s),
              (t.pending_buf[t.pending - 4] = i),
              (t.pending_buf[t.pending - 3] = i >> 8),
              (t.pending_buf[t.pending - 2] = ~i),
              (t.pending_buf[t.pending - 1] = ~i >> 8),
              gt(t.strm),
              n &&
                (n > i && (n = i),
                t.strm.output.set(
                  t.window.subarray(t.block_start, t.block_start + n),
                  t.strm.next_out,
                ),
                (t.strm.next_out += n),
                (t.strm.avail_out -= n),
                (t.strm.total_out += n),
                (t.block_start += n),
                (i -= n)),
              i &&
                (yt(t.strm, t.strm.output, t.strm.next_out, i),
                (t.strm.next_out += i),
                (t.strm.avail_out -= i),
                (t.strm.total_out += i)),
              0 !== s))
          );

      );
      return (
        (o -= t.strm.avail_in) &&
          (o >= t.w_size
            ? ((t.matches = 2),
              t.window.set(
                t.strm.input.subarray(
                  t.strm.next_in - t.w_size,
                  t.strm.next_in,
                ),
                0,
              ),
              (t.strstart = t.w_size),
              (t.insert = t.strstart))
            : (t.window_size - t.strstart <= o &&
                ((t.strstart -= t.w_size),
                t.window.set(
                  t.window.subarray(t.w_size, t.w_size + t.strstart),
                  0,
                ),
                t.matches < 2 && t.matches++,
                t.insert > t.strstart && (t.insert = t.strstart)),
              t.window.set(
                t.strm.input.subarray(t.strm.next_in - o, t.strm.next_in),
                t.strstart,
              ),
              (t.strstart += o),
              (t.insert += o > t.w_size - t.insert ? t.w_size - t.insert : o)),
          (t.block_start = t.strstart)),
        t.high_water < t.strstart && (t.high_water = t.strstart),
        s
          ? 4
          : e !== W &&
              e !== Q &&
              0 === t.strm.avail_in &&
              t.strstart === t.block_start
            ? 2
            : ((r = t.window_size - t.strstart),
              t.strm.avail_in > r &&
                t.block_start >= t.w_size &&
                ((t.block_start -= t.w_size),
                (t.strstart -= t.w_size),
                t.window.set(
                  t.window.subarray(t.w_size, t.w_size + t.strstart),
                  0,
                ),
                t.matches < 2 && t.matches++,
                (r += t.w_size),
                t.insert > t.strstart && (t.insert = t.strstart)),
              r > t.strm.avail_in && (r = t.strm.avail_in),
              r &&
                (yt(t.strm, t.window, t.strstart, r),
                (t.strstart += r),
                (t.insert +=
                  r > t.w_size - t.insert ? t.w_size - t.insert : r)),
              t.high_water < t.strstart && (t.high_water = t.strstart),
              (r = (t.bi_valid + 42) >> 3),
              (r =
                65535 < t.pending_buf_size - r
                  ? 65535
                  : t.pending_buf_size - r),
              (a = r > t.w_size ? t.w_size : r),
              (n = t.strstart - t.block_start),
              (n >= a ||
                ((n || e === Q) &&
                  e !== W &&
                  0 === t.strm.avail_in &&
                  n <= r)) &&
                ((i = n > r ? r : n),
                (s = e === Q && 0 === t.strm.avail_in && i === n ? 1 : 0),
                P(t, t.block_start, i, s),
                (t.block_start += i),
                gt(t.strm)),
              s ? 3 : 1)
      );
    },
    Et = (t, e) => {
      let a, i;
      for (;;) {
        if (t.lookahead < ut) {
          if ((zt(t), t.lookahead < ut && e === W)) return 1;
          if (0 === t.lookahead) break;
        }
        if (
          ((a = 0),
          3 <= t.lookahead &&
            ((t.ins_h = bt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
            (a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = t.strstart)),
          0 !== a &&
            t.strstart - a <= t.w_size - ut &&
            (t.match_length = xt(t, a)),
          3 <= t.match_length)
        )
          if (
            ((i = G(t, t.strstart - t.match_start, t.match_length - 3)),
            (t.lookahead -= t.match_length),
            t.match_length <= t.max_lazy_match && 3 <= t.lookahead)
          ) {
            for (
              t.match_length--;
              t.strstart++,
                (t.ins_h = bt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
                (a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                (t.head[t.ins_h] = t.strstart),
                0 != --t.match_length;

            );
            t.strstart++;
          } else
            (t.strstart += t.match_length),
              (t.match_length = 0),
              (t.ins_h = t.window[t.strstart]),
              (t.ins_h = bt(t, t.ins_h, t.window[t.strstart + 1]));
        else (i = G(t, 0, t.window[t.strstart])), t.lookahead--, t.strstart++;
        if (i && (pt(t, !1), 0 === t.strm.avail_out)) return 1;
      }
      return (
        (t.insert = t.strstart < 2 ? t.strstart : 2),
        e === Q
          ? (pt(t, !0), 0 === t.strm.avail_out ? 3 : 4)
          : t.sym_next && (pt(t, !1), 0 === t.strm.avail_out)
            ? 1
            : 2
      );
    },
    Rt = (t, e) => {
      let a, i, n;
      for (;;) {
        if (t.lookahead < ut) {
          if ((zt(t), t.lookahead < ut && e === W)) return 1;
          if (0 === t.lookahead) break;
        }
        if (
          ((a = 0),
          3 <= t.lookahead &&
            ((t.ins_h = bt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
            (a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
            (t.head[t.ins_h] = t.strstart)),
          (t.prev_length = t.match_length),
          (t.prev_match = t.match_start),
          (t.match_length = 2),
          0 !== a &&
            t.prev_length < t.max_lazy_match &&
            t.strstart - a <= t.w_size - ut &&
            ((t.match_length = xt(t, a)),
            t.match_length <= 5 &&
              (t.strategy === rt ||
                (3 === t.match_length && 4096 < t.strstart - t.match_start)) &&
              (t.match_length = 2)),
          3 <= t.prev_length && t.match_length <= t.prev_length)
        ) {
          for (
            n = t.strstart + t.lookahead - 3,
              i = G(t, t.strstart - 1 - t.prev_match, t.prev_length - 3),
              t.lookahead -= t.prev_length - 1,
              t.prev_length -= 2;
            ++t.strstart <= n &&
              ((t.ins_h = bt(t, t.ins_h, t.window[t.strstart + 3 - 1])),
              (a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
              (t.head[t.ins_h] = t.strstart)),
              0 != --t.prev_length;

          );
          if (
            ((t.match_available = 0),
            (t.match_length = 2),
            t.strstart++,
            i && (pt(t, !1), 0 === t.strm.avail_out))
          )
            return 1;
        } else if (t.match_available) {
          if (
            ((i = G(t, 0, t.window[t.strstart - 1])),
            i && pt(t, !1),
            t.strstart++,
            t.lookahead--,
            0 === t.strm.avail_out)
          )
            return 1;
        } else (t.match_available = 1), t.strstart++, t.lookahead--;
      }
      return (
        t.match_available &&
          ((i = G(t, 0, t.window[t.strstart - 1])), (t.match_available = 0)),
        (t.insert = t.strstart < 2 ? t.strstart : 2),
        e === Q
          ? (pt(t, !0), 0 === t.strm.avail_out ? 3 : 4)
          : t.sym_next && (pt(t, !1), 0 === t.strm.avail_out)
            ? 1
            : 2
      );
    };
  function Zt(t, e, a, i, n) {
    (this.good_length = t),
      (this.max_lazy = e),
      (this.nice_length = a),
      (this.max_chain = i),
      (this.func = n);
  }
  const Ut = [
    new Zt(0, 0, 0, 0, At),
    new Zt(4, 4, 8, 4, Et),
    new Zt(4, 5, 16, 8, Et),
    new Zt(4, 6, 32, 32, Et),
    new Zt(4, 4, 16, 16, Rt),
    new Zt(8, 16, 32, 32, Rt),
    new Zt(8, 16, 128, 128, Rt),
    new Zt(8, 32, 128, 256, Rt),
    new Zt(32, 128, 258, 1024, Rt),
    new Zt(32, 258, 258, 4096, Rt),
  ];
  function St() {
    (this.strm = null),
      (this.status = 0),
      (this.pending_buf = null),
      (this.pending_buf_size = 0),
      (this.pending_out = 0),
      (this.pending = 0),
      (this.wrap = 0),
      (this.gzhead = null),
      (this.gzindex = 0),
      (this.method = _t),
      (this.last_flush = -1),
      (this.w_size = 0),
      (this.w_bits = 0),
      (this.w_mask = 0),
      (this.window = null),
      (this.window_size = 0),
      (this.prev = null),
      (this.head = null),
      (this.ins_h = 0),
      (this.hash_size = 0),
      (this.hash_bits = 0),
      (this.hash_mask = 0),
      (this.hash_shift = 0),
      (this.block_start = 0),
      (this.match_length = 0),
      (this.prev_match = 0),
      (this.match_available = 0),
      (this.strstart = 0),
      (this.match_start = 0),
      (this.lookahead = 0),
      (this.prev_length = 0),
      (this.max_chain_length = 0),
      (this.max_lazy_match = 0),
      (this.level = 0),
      (this.strategy = 0),
      (this.good_match = 0),
      (this.nice_match = 0),
      (this.dyn_ltree = new Uint16Array(1146)),
      (this.dyn_dtree = new Uint16Array(122)),
      (this.bl_tree = new Uint16Array(78)),
      mt(this.dyn_ltree),
      mt(this.dyn_dtree),
      mt(this.bl_tree),
      (this.l_desc = null),
      (this.d_desc = null),
      (this.bl_desc = null),
      (this.bl_count = new Uint16Array(16)),
      (this.heap = new Uint16Array(573)),
      mt(this.heap),
      (this.heap_len = 0),
      (this.heap_max = 0),
      (this.depth = new Uint16Array(573)),
      mt(this.depth),
      (this.sym_buf = 0),
      (this.lit_bufsize = 0),
      (this.sym_next = 0),
      (this.sym_end = 0),
      (this.opt_len = 0),
      (this.static_len = 0),
      (this.matches = 0),
      (this.insert = 0),
      (this.bi_buf = 0),
      (this.bi_valid = 0);
  }
  var Dt = (t) => {
      if (!t) return 1;
      var e = t.state;
      return !e ||
        e.strm !== t ||
        (42 !== e.status &&
          57 !== e.status &&
          69 !== e.status &&
          73 !== e.status &&
          91 !== e.status &&
          103 !== e.status &&
          113 !== e.status &&
          666 !== e.status)
        ? 1
        : 0;
    },
    Tt = (t) => {
      if (Dt(t)) return ct(t, et);
      (t.total_in = t.total_out = 0), (t.data_type = dt);
      const e = t.state;
      return (
        (e.pending = 0),
        (e.pending_out = 0),
        e.wrap < 0 && (e.wrap = -e.wrap),
        (e.status = 2 === e.wrap ? 57 : e.wrap ? 42 : 113),
        (t.adler = 2 === e.wrap ? 0 : 1),
        (e.last_flush = -2),
        K(e),
        $
      );
    },
    Ot = (t) => {
      var e = Tt(t);
      return (
        e === $ &&
          (((t = t.state).window_size = 2 * t.w_size),
          mt(t.head),
          (t.max_lazy_match = Ut[t.level].max_lazy),
          (t.good_match = Ut[t.level].good_length),
          (t.nice_match = Ut[t.level].nice_length),
          (t.max_chain_length = Ut[t.level].max_chain),
          (t.strstart = 0),
          (t.block_start = 0),
          (t.lookahead = 0),
          (t.insert = 0),
          (t.match_length = t.prev_length = 2),
          (t.match_available = 0),
          (t.ins_h = 0)),
        e
      );
    },
    It = (t, e, a, i, n, r) => {
      if (!t) return et;
      let s = 1;
      if (
        (e === nt && (e = 6),
        i < 0 ? ((s = 0), (i = -i)) : 15 < i && ((s = 2), (i -= 16)),
        n < 1 ||
          9 < n ||
          a !== _t ||
          i < 8 ||
          15 < i ||
          e < 0 ||
          9 < e ||
          r < 0 ||
          lt < r ||
          (8 === i && 1 !== s))
      )
        return ct(t, et);
      8 === i && (i = 9);
      const o = new St();
      return (
        (t.state = o),
        (o.strm = t),
        (o.status = 42),
        (o.wrap = s),
        (o.gzhead = null),
        (o.w_bits = i),
        (o.w_size = 1 << o.w_bits),
        (o.w_mask = o.w_size - 1),
        (o.hash_bits = n + 7),
        (o.hash_size = 1 << o.hash_bits),
        (o.hash_mask = o.hash_size - 1),
        (o.hash_shift = ~~((o.hash_bits + 3 - 1) / 3)),
        (o.window = new Uint8Array(2 * o.w_size)),
        (o.head = new Uint16Array(o.hash_size)),
        (o.prev = new Uint16Array(o.w_size)),
        (o.lit_bufsize = 1 << (n + 6)),
        (o.pending_buf_size = 4 * o.lit_bufsize),
        (o.pending_buf = new Uint8Array(o.pending_buf_size)),
        (o.sym_buf = o.lit_bufsize),
        (o.sym_end = 3 * (o.lit_bufsize - 1)),
        (o.level = e),
        (o.strategy = r),
        (o.method = a),
        Ot(t)
      );
    },
    Ft = {
      deflateInit: (t, e) => It(t, e, _t, 15, 8, ht),
      deflateInit2: It,
      deflateReset: Ot,
      deflateResetKeep: Tt,
      deflateSetHeader: (t, e) =>
        Dt(t) || 2 !== t.state.wrap ? et : ((t.state.gzhead = e), $),
      deflate: (i, t) => {
        if (Dt(i) || V < t || t < 0) return i ? ct(i, et) : et;
        const n = i.state;
        if (
          !i.output ||
          (0 !== i.avail_in && !i.input) ||
          (666 === n.status && t !== Q)
        )
          return ct(i, 0 === i.avail_out ? it : et);
        var e = n.last_flush;
        if (((n.last_flush = t), 0 !== n.pending)) {
          if ((gt(i), 0 === i.avail_out)) return (n.last_flush = -1), $;
        } else if (0 === i.avail_in && wt(t) <= wt(e) && t !== Q)
          return ct(i, it);
        if (666 === n.status && 0 !== i.avail_in) return ct(i, it);
        if (
          (42 === n.status && 0 === n.wrap && (n.status = 113), 42 === n.status)
        ) {
          let t = (_t + ((n.w_bits - 8) << 4)) << 8,
            e = -1;
          if (
            ((e =
              n.strategy >= st || n.level < 2
                ? 0
                : n.level < 6
                  ? 1
                  : 6 === n.level
                    ? 2
                    : 3),
            (t |= e << 6),
            0 !== n.strstart && (t |= 32),
            (t += 31 - (t % 31)),
            vt(n, t),
            0 !== n.strstart && (vt(n, i.adler >>> 16), vt(n, 65535 & i.adler)),
            (i.adler = 1),
            (n.status = 113),
            gt(i),
            0 !== n.pending)
          )
            return (n.last_flush = -1), $;
        }
        if (57 === n.status)
          if (((i.adler = 0), kt(n, 31), kt(n, 139), kt(n, 8), n.gzhead))
            kt(
              n,
              (n.gzhead.text ? 1 : 0) +
                (n.gzhead.hcrc ? 2 : 0) +
                (n.gzhead.extra ? 4 : 0) +
                (n.gzhead.name ? 8 : 0) +
                (n.gzhead.comment ? 16 : 0),
            ),
              kt(n, 255 & n.gzhead.time),
              kt(n, (n.gzhead.time >> 8) & 255),
              kt(n, (n.gzhead.time >> 16) & 255),
              kt(n, (n.gzhead.time >> 24) & 255),
              kt(
                n,
                9 === n.level ? 2 : n.strategy >= st || n.level < 2 ? 4 : 0,
              ),
              kt(n, 255 & n.gzhead.os),
              n.gzhead.extra &&
                n.gzhead.extra.length &&
                (kt(n, 255 & n.gzhead.extra.length),
                kt(n, (n.gzhead.extra.length >> 8) & 255)),
              n.gzhead.hcrc &&
                (i.adler = M(i.adler, n.pending_buf, n.pending, 0)),
              (n.gzindex = 0),
              (n.status = 69);
          else if (
            (kt(n, 0),
            kt(n, 0),
            kt(n, 0),
            kt(n, 0),
            kt(n, 0),
            kt(n, 9 === n.level ? 2 : n.strategy >= st || n.level < 2 ? 4 : 0),
            kt(n, 3),
            (n.status = 113),
            gt(i),
            0 !== n.pending)
          )
            return (n.last_flush = -1), $;
        if (69 === n.status) {
          if (n.gzhead.extra) {
            let t = n.pending,
              e = (65535 & n.gzhead.extra.length) - n.gzindex;
            for (; n.pending + e > n.pending_buf_size; ) {
              var r = n.pending_buf_size - n.pending;
              if (
                (n.pending_buf.set(
                  n.gzhead.extra.subarray(n.gzindex, n.gzindex + r),
                  n.pending,
                ),
                (n.pending = n.pending_buf_size),
                n.gzhead.hcrc &&
                  n.pending > t &&
                  (i.adler = M(i.adler, n.pending_buf, n.pending - t, t)),
                (n.gzindex += r),
                gt(i),
                0 !== n.pending)
              )
                return (n.last_flush = -1), $;
              (t = 0), (e -= r);
            }
            let a = new Uint8Array(n.gzhead.extra);
            n.pending_buf.set(a.subarray(n.gzindex, n.gzindex + e), n.pending),
              (n.pending += e),
              n.gzhead.hcrc &&
                n.pending > t &&
                (i.adler = M(i.adler, n.pending_buf, n.pending - t, t)),
              (n.gzindex = 0);
          }
          n.status = 73;
        }
        if (73 === n.status) {
          if (n.gzhead.name) {
            let t = n.pending,
              e;
            do {
              if (n.pending === n.pending_buf_size) {
                if (
                  (n.gzhead.hcrc &&
                    n.pending > t &&
                    (i.adler = M(i.adler, n.pending_buf, n.pending - t, t)),
                  gt(i),
                  0 !== n.pending)
                )
                  return (n.last_flush = -1), $;
                t = 0;
              }
            } while (
              ((e =
                n.gzindex < n.gzhead.name.length
                  ? 255 & n.gzhead.name.charCodeAt(n.gzindex++)
                  : 0),
              kt(n, e),
              0 !== e)
            );
            n.gzhead.hcrc &&
              n.pending > t &&
              (i.adler = M(i.adler, n.pending_buf, n.pending - t, t)),
              (n.gzindex = 0);
          }
          n.status = 91;
        }
        if (91 === n.status) {
          if (n.gzhead.comment) {
            let t = n.pending,
              e;
            do {
              if (n.pending === n.pending_buf_size) {
                if (
                  (n.gzhead.hcrc &&
                    n.pending > t &&
                    (i.adler = M(i.adler, n.pending_buf, n.pending - t, t)),
                  gt(i),
                  0 !== n.pending)
                )
                  return (n.last_flush = -1), $;
                t = 0;
              }
            } while (
              ((e =
                n.gzindex < n.gzhead.comment.length
                  ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++)
                  : 0),
              kt(n, e),
              0 !== e)
            );
            n.gzhead.hcrc &&
              n.pending > t &&
              (i.adler = M(i.adler, n.pending_buf, n.pending - t, t));
          }
          n.status = 103;
        }
        if (103 === n.status) {
          if (n.gzhead.hcrc) {
            if (n.pending + 2 > n.pending_buf_size && (gt(i), 0 !== n.pending))
              return (n.last_flush = -1), $;
            kt(n, 255 & i.adler), kt(n, (i.adler >> 8) & 255), (i.adler = 0);
          }
          if (((n.status = 113), gt(i), 0 !== n.pending))
            return (n.last_flush = -1), $;
        }
        if (
          0 !== i.avail_in ||
          0 !== n.lookahead ||
          (t !== W && 666 !== n.status)
        ) {
          e =
            0 === n.level
              ? At(n, t)
              : n.strategy === st
                ? ((t, e) => {
                    let a;
                    for (;;) {
                      if (0 === t.lookahead && (zt(t), 0 === t.lookahead)) {
                        if (e === W) return 1;
                        break;
                      }
                      if (
                        ((t.match_length = 0),
                        (a = G(t, 0, t.window[t.strstart])),
                        t.lookahead--,
                        t.strstart++,
                        a && (pt(t, !1), 0 === t.strm.avail_out))
                      )
                        return 1;
                    }
                    return (
                      (t.insert = 0),
                      e === Q
                        ? (pt(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                        : t.sym_next && (pt(t, !1), 0 === t.strm.avail_out)
                          ? 1
                          : 2
                    );
                  })(n, t)
                : n.strategy === ot
                  ? ((t, e) => {
                      let a, i, n, r;
                      for (var s = t.window; ; ) {
                        if (t.lookahead <= ft) {
                          if ((zt(t), t.lookahead <= ft && e === W)) return 1;
                          if (0 === t.lookahead) break;
                        }
                        if (
                          ((t.match_length = 0),
                          3 <= t.lookahead &&
                            0 < t.strstart &&
                            ((n = t.strstart - 1),
                            (i = s[n]),
                            i === s[++n] && i === s[++n] && i === s[++n]))
                        ) {
                          for (
                            r = t.strstart + ft;
                            i === s[++n] &&
                            i === s[++n] &&
                            i === s[++n] &&
                            i === s[++n] &&
                            i === s[++n] &&
                            i === s[++n] &&
                            i === s[++n] &&
                            i === s[++n] &&
                            n < r;

                          );
                          (t.match_length = ft - (r - n)),
                            t.match_length > t.lookahead &&
                              (t.match_length = t.lookahead);
                        }
                        if (
                          (3 <= t.match_length
                            ? ((a = G(t, 1, t.match_length - 3)),
                              (t.lookahead -= t.match_length),
                              (t.strstart += t.match_length),
                              (t.match_length = 0))
                            : ((a = G(t, 0, t.window[t.strstart])),
                              t.lookahead--,
                              t.strstart++),
                          a && (pt(t, !1), 0 === t.strm.avail_out))
                        )
                          return 1;
                      }
                      return (
                        (t.insert = 0),
                        e === Q
                          ? (pt(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                          : t.sym_next && (pt(t, !1), 0 === t.strm.avail_out)
                            ? 1
                            : 2
                      );
                    })(n, t)
                  : Ut[n.level].func(n, t);
          if (((3 !== e && 4 !== e) || (n.status = 666), 1 === e || 3 === e))
            return 0 === i.avail_out && (n.last_flush = -1), $;
          if (
            2 === e &&
            (t === q
              ? X(n)
              : t !== V &&
                (P(n, 0, 0, !1),
                t === J &&
                  (mt(n.head),
                  0 === n.lookahead &&
                    ((n.strstart = 0), (n.block_start = 0), (n.insert = 0)))),
            gt(i),
            0 === i.avail_out)
          )
            return (n.last_flush = -1), $;
        }
        return t !== Q
          ? $
          : n.wrap <= 0
            ? tt
            : (2 === n.wrap
                ? (kt(n, 255 & i.adler),
                  kt(n, (i.adler >> 8) & 255),
                  kt(n, (i.adler >> 16) & 255),
                  kt(n, (i.adler >> 24) & 255),
                  kt(n, 255 & i.total_in),
                  kt(n, (i.total_in >> 8) & 255),
                  kt(n, (i.total_in >> 16) & 255),
                  kt(n, (i.total_in >> 24) & 255))
                : (vt(n, i.adler >>> 16), vt(n, 65535 & i.adler)),
              gt(i),
              0 < n.wrap && (n.wrap = -n.wrap),
              0 !== n.pending ? $ : tt);
      },
      deflateEnd: (t) => {
        if (Dt(t)) return et;
        var e = t.state.status;
        return (t.state = null), 113 === e ? ct(t, at) : $;
      },
      deflateSetDictionary: (t, e) => {
        let a = e.length;
        if (Dt(t)) return et;
        const i = t.state;
        var n = i.wrap;
        if (2 === n || (1 === n && 42 !== i.status) || i.lookahead) return et;
        if (
          (1 === n && (t.adler = B(t.adler, e, a, 0)),
          (i.wrap = 0),
          a >= i.w_size)
        ) {
          0 === n &&
            (mt(i.head), (i.strstart = 0), (i.block_start = 0), (i.insert = 0));
          let t = new Uint8Array(i.w_size);
          t.set(e.subarray(a - i.w_size, a), 0), (e = t), (a = i.w_size);
        }
        var r = t.avail_in,
          s = t.next_in,
          o = t.input;
        for (
          t.avail_in = a, t.next_in = 0, t.input = e, zt(i);
          3 <= i.lookahead;

        ) {
          let t = i.strstart,
            e = i.lookahead - 2;
          for (
            ;
            (i.ins_h = bt(i, i.ins_h, i.window[t + 3 - 1])),
              (i.prev[t & i.w_mask] = i.head[i.ins_h]),
              (i.head[i.ins_h] = t),
              t++,
              --e;

          );
          (i.strstart = t), (i.lookahead = 2), zt(i);
        }
        return (
          (i.strstart += i.lookahead),
          (i.block_start = i.strstart),
          (i.insert = i.lookahead),
          (i.lookahead = 0),
          (i.match_length = i.prev_length = 2),
          (i.match_available = 0),
          (t.next_in = s),
          (t.input = o),
          (t.avail_in = r),
          (i.wrap = n),
          $
        );
      },
      deflateInfo: "pako deflate (from Nodeca project)",
    },
    Lt = {
      assign: function (t) {
        const e = Array.prototype.slice.call(arguments, 1);
        for (; e.length; ) {
          var a = e.shift();
          if (a) {
            if ("object" != typeof a)
              throw new TypeError(a + "must be non-object");
            for (const r in a)
              (i = a),
                (n = r),
                Object.prototype.hasOwnProperty.call(i, n) && (t[r] = a[r]);
          }
        }
        var i, n;
        return t;
      },
      flattenChunks: (i) => {
        let a = 0;
        for (let t = 0, e = i.length; t < e; t++) a += i[t].length;
        const n = new Uint8Array(a);
        for (let t = 0, e = 0, a = i.length; t < a; t++) {
          var r = i[t];
          n.set(r, e), (e += r.length);
        }
        return n;
      },
    };
  let Nt = !0;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (t) {
    Nt = !1;
  }
  const Bt = new Uint8Array(256);
  for (let t = 0; t < 256; t++)
    Bt[t] =
      252 <= t
        ? 6
        : 248 <= t
          ? 5
          : 240 <= t
            ? 4
            : 224 <= t
              ? 3
              : 192 <= t
                ? 2
                : 1;
  Bt[254] = Bt[254] = 1;
  var Ct = {
    string2buf: (t) => {
      if ("function" == typeof TextEncoder && TextEncoder.prototype.encode)
        return new TextEncoder().encode(t);
      let e,
        a,
        i,
        n,
        r,
        s = t.length,
        o = 0;
      for (n = 0; n < s; n++)
        (a = t.charCodeAt(n)),
          55296 == (64512 & a) &&
            n + 1 < s &&
            ((i = t.charCodeAt(n + 1)),
            56320 == (64512 & i) &&
              ((a = 65536 + ((a - 55296) << 10) + (i - 56320)), n++)),
          (o += a < 128 ? 1 : a < 2048 ? 2 : a < 65536 ? 3 : 4);
      for (e = new Uint8Array(o), r = 0, n = 0; r < o; n++)
        (a = t.charCodeAt(n)),
          55296 == (64512 & a) &&
            n + 1 < s &&
            ((i = t.charCodeAt(n + 1)),
            56320 == (64512 & i) &&
              ((a = 65536 + ((a - 55296) << 10) + (i - 56320)), n++)),
          a < 128
            ? (e[r++] = a)
            : (a < 2048
                ? (e[r++] = 192 | (a >>> 6))
                : (a < 65536
                    ? (e[r++] = 224 | (a >>> 12))
                    : ((e[r++] = 240 | (a >>> 18)),
                      (e[r++] = 128 | ((a >>> 12) & 63))),
                  (e[r++] = 128 | ((a >>> 6) & 63))),
              (e[r++] = 128 | (63 & a)));
      return e;
    },
    buf2string: (a, t) => {
      var i = t || a.length;
      if ("function" == typeof TextDecoder && TextDecoder.prototype.decode)
        return new TextDecoder().decode(a.subarray(0, t));
      let n, r;
      const s = new Array(2 * i);
      for (r = 0, n = 0; n < i; ) {
        let e = a[n++];
        if (e < 128) s[r++] = e;
        else {
          let t = Bt[e];
          if (4 < t) (s[r++] = 65533), (n += t - 1);
          else {
            for (e &= 2 === t ? 31 : 3 === t ? 15 : 7; 1 < t && n < i; )
              (e = (e << 6) | (63 & a[n++])), t--;
            1 < t
              ? (s[r++] = 65533)
              : e < 65536
                ? (s[r++] = e)
                : ((e -= 65536),
                  (s[r++] = 55296 | ((e >> 10) & 1023)),
                  (s[r++] = 56320 | (1023 & e)));
          }
        }
      }
      return ((e, a) => {
        if (a < 65534 && e.subarray && Nt)
          return String.fromCharCode.apply(
            null,
            e.length === a ? e : e.subarray(0, a),
          );
        let i = "";
        for (let t = 0; t < a; t++) i += String.fromCharCode(e[t]);
        return i;
      })(s, r);
    },
    utf8border: (t, e) => {
      (e = e || t.length) > t.length && (e = t.length);
      let a = e - 1;
      for (; 0 <= a && 128 == (192 & t[a]); ) a--;
      return !(a < 0) && 0 !== a && a + Bt[t[a]] > e ? a : e;
    },
  };
  var Mt = function () {
    (this.input = null),
      (this.next_in = 0),
      (this.avail_in = 0),
      (this.total_in = 0),
      (this.output = null),
      (this.next_out = 0),
      (this.avail_out = 0),
      (this.total_out = 0),
      (this.msg = ""),
      (this.state = null),
      (this.data_type = 2),
      (this.adler = 0);
  };
  const Ht = Object.prototype.toString,
    {
      Z_NO_FLUSH: jt,
      Z_SYNC_FLUSH: Kt,
      Z_FULL_FLUSH: Pt,
      Z_FINISH: Yt,
      Z_OK: Gt,
      Z_STREAM_END: Xt,
      Z_DEFAULT_COMPRESSION: Wt,
      Z_DEFAULT_STRATEGY: qt,
      Z_DEFLATED: Jt,
    } = j;
  function Qt(t) {
    this.options = Lt.assign(
      {
        level: Wt,
        method: Jt,
        chunkSize: 16384,
        windowBits: 15,
        memLevel: 8,
        strategy: qt,
      },
      t || {},
    );
    let e = this.options;
    e.raw && 0 < e.windowBits
      ? (e.windowBits = -e.windowBits)
      : e.gzip && 0 < e.windowBits && e.windowBits < 16 && (e.windowBits += 16),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new Mt()),
      (this.strm.avail_out = 0);
    let a = Ft.deflateInit2(
      this.strm,
      e.level,
      e.method,
      e.windowBits,
      e.memLevel,
      e.strategy,
    );
    if (a !== Gt) throw new Error(H[a]);
    if ((e.header && Ft.deflateSetHeader(this.strm, e.header), e.dictionary)) {
      let t;
      if (
        ((t =
          "string" == typeof e.dictionary
            ? Ct.string2buf(e.dictionary)
            : "[object ArrayBuffer]" === Ht.call(e.dictionary)
              ? new Uint8Array(e.dictionary)
              : e.dictionary),
        (a = Ft.deflateSetDictionary(this.strm, t)),
        a !== Gt)
      )
        throw new Error(H[a]);
      this._dict_set = !0;
    }
  }
  function Vt(t, e) {
    const a = new Qt(e);
    if ((a.push(t, !0), a.err)) throw a.msg || H[a.err];
    return a.result;
  }
  (Qt.prototype.push = function (t, e) {
    const a = this.strm;
    var i = this.options.chunkSize;
    let n, r;
    if (this.ended) return !1;
    for (
      r = e === ~~e ? e : !0 === e ? Yt : jt,
        "string" == typeof t
          ? (a.input = Ct.string2buf(t))
          : "[object ArrayBuffer]" === Ht.call(t)
            ? (a.input = new Uint8Array(t))
            : (a.input = t),
        a.next_in = 0,
        a.avail_in = a.input.length;
      ;

    )
      if (
        (0 === a.avail_out &&
          ((a.output = new Uint8Array(i)), (a.next_out = 0), (a.avail_out = i)),
        (r === Kt || r === Pt) && a.avail_out <= 6)
      )
        this.onData(a.output.subarray(0, a.next_out)), (a.avail_out = 0);
      else {
        if (((n = Ft.deflate(a, r)), n === Xt))
          return (
            0 < a.next_out && this.onData(a.output.subarray(0, a.next_out)),
            (n = Ft.deflateEnd(this.strm)),
            this.onEnd(n),
            (this.ended = !0),
            n === Gt
          );
        if (0 !== a.avail_out) {
          if (0 < r && 0 < a.next_out)
            this.onData(a.output.subarray(0, a.next_out)), (a.avail_out = 0);
          else if (0 === a.avail_in) break;
        } else this.onData(a.output);
      }
    return !0;
  }),
    (Qt.prototype.onData = function (t) {
      this.chunks.push(t);
    }),
    (Qt.prototype.onEnd = function (t) {
      t === Gt && (this.result = Lt.flattenChunks(this.chunks)),
        (this.chunks = []),
        (this.err = t),
        (this.msg = this.strm.msg);
    });
  var $t = {
      Deflate: Qt,
      deflate: Vt,
      deflateRaw: function (t, e) {
        return ((e = e || {}).raw = !0), Vt(t, e);
      },
      gzip: function (t, e) {
        return ((e = e || {}).gzip = !0), Vt(t, e);
      },
      constants: j,
    },
    te = 16209,
    ee = new Uint16Array([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59,
      67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
    ]),
    ae = new Uint8Array([
      16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19,
      19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
    ]),
    ie = new Uint16Array([
      1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513,
      769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0,
    ]),
    ne = new Uint8Array([
      16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23,
      24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
    ]),
    re = (t, e, a, i, n, r, s, o) => {
      var l = o.bits;
      let h = 0,
        d = 0,
        _ = 0,
        f = 0,
        u = 0,
        c = 0,
        w = 0,
        m = 0,
        b = 0,
        g = 0,
        p,
        k,
        v,
        y,
        x,
        z = null,
        A;
      const E = new Uint16Array(16),
        R = new Uint16Array(16);
      let Z = null,
        U,
        S,
        D;
      for (h = 0; h <= 15; h++) E[h] = 0;
      for (d = 0; d < i; d++) E[e[a + d]]++;
      for (u = l, f = 15; 1 <= f && 0 === E[f]; f--);
      if ((u > f && (u = f), 0 === f))
        return (n[r++] = 20971520), (n[r++] = 20971520), (o.bits = 1), 0;
      for (_ = 1; _ < f && 0 === E[_]; _++);
      for (u < _ && (u = _), m = 1, h = 1; h <= 15; h++)
        if (((m <<= 1), (m -= E[h]), m < 0)) return -1;
      if (0 < m && (0 === t || 1 !== f)) return -1;
      for (R[1] = 0, h = 1; h < 15; h++) R[h + 1] = R[h] + E[h];
      for (d = 0; d < i; d++) 0 !== e[a + d] && (s[R[e[a + d]]++] = d);
      if (
        ((A =
          0 === t
            ? ((z = Z = s), 20)
            : 1 === t
              ? ((z = ee), (Z = ae), 257)
              : ((z = ie), (Z = ne), 0)),
        (g = 0),
        (d = 0),
        (h = _),
        (x = r),
        (c = u),
        (w = 0),
        (v = -1),
        (b = 1 << u),
        (y = b - 1),
        (1 === t && 852 < b) || (2 === t && 592 < b))
      )
        return 1;
      for (;;) {
        for (
          U = h - w,
            D =
              s[d] + 1 < A
                ? ((S = 0), s[d])
                : s[d] >= A
                  ? ((S = Z[s[d] - A]), z[s[d] - A])
                  : ((S = 96), 0),
            p = 1 << (h - w),
            k = 1 << c,
            _ = k;
          (k -= p),
            (n[x + (g >> w) + k] = (U << 24) | (S << 16) | D | 0),
            0 !== k;

        );
        for (p = 1 << (h - 1); g & p; ) p >>= 1;
        if ((0 !== p ? ((g &= p - 1), (g += p)) : (g = 0), d++, 0 == --E[h])) {
          if (h === f) break;
          h = e[a + s[d]];
        }
        if (h > u && (g & y) !== v) {
          for (
            0 === w && (w = u), x += _, c = h - w, m = 1 << c;
            c + w < f && ((m -= E[c + w]), !(m <= 0));

          )
            c++, (m <<= 1);
          if (((b += 1 << c), (1 === t && 852 < b) || (2 === t && 592 < b)))
            return 1;
          (v = g & y), (n[v] = (u << 24) | (c << 16) | (x - r) | 0);
        }
      }
      return (
        0 !== g && (n[x + g] = ((h - w) << 24) | (64 << 16) | 0),
        (o.bits = u),
        0
      );
    },
    {
      Z_FINISH: se,
      Z_BLOCK: oe,
      Z_TREES: le,
      Z_OK: he,
      Z_STREAM_END: de,
      Z_NEED_DICT: _e,
      Z_STREAM_ERROR: fe,
      Z_DATA_ERROR: ue,
      Z_MEM_ERROR: ce,
      Z_BUF_ERROR: we,
      Z_DEFLATED: me,
    } = j,
    be = 16180,
    ge = 16190,
    pe = 16191,
    ke = 16199,
    ve = 16200,
    ye = 16209,
    xe = (t) =>
      ((t >>> 24) & 255) +
      ((t >>> 8) & 65280) +
      ((65280 & t) << 8) +
      ((255 & t) << 24);
  function ze() {
    (this.strm = null),
      (this.mode = 0),
      (this.last = !1),
      (this.wrap = 0),
      (this.havedict = !1),
      (this.flags = 0),
      (this.dmax = 0),
      (this.check = 0),
      (this.total = 0),
      (this.head = null),
      (this.wbits = 0),
      (this.wsize = 0),
      (this.whave = 0),
      (this.wnext = 0),
      (this.window = null),
      (this.hold = 0),
      (this.bits = 0),
      (this.length = 0),
      (this.offset = 0),
      (this.extra = 0),
      (this.lencode = null),
      (this.distcode = null),
      (this.lenbits = 0),
      (this.distbits = 0),
      (this.ncode = 0),
      (this.nlen = 0),
      (this.ndist = 0),
      (this.have = 0),
      (this.next = null),
      (this.lens = new Uint16Array(320)),
      (this.work = new Uint16Array(288)),
      (this.lendyn = null),
      (this.distdyn = null),
      (this.sane = 0),
      (this.back = 0),
      (this.was = 0);
  }
  var Ae = (t) => {
      if (!t) return 1;
      var e = t.state;
      return !e || e.strm !== t || e.mode < be || 16211 < e.mode ? 1 : 0;
    },
    Ee = (t) => {
      if (Ae(t)) return fe;
      const e = t.state;
      return (
        (t.total_in = t.total_out = e.total = 0),
        (t.msg = ""),
        e.wrap && (t.adler = 1 & e.wrap),
        (e.mode = be),
        (e.last = 0),
        (e.havedict = 0),
        (e.flags = -1),
        (e.dmax = 32768),
        (e.head = null),
        (e.hold = 0),
        (e.bits = 0),
        (e.lencode = e.lendyn = new Int32Array(852)),
        (e.distcode = e.distdyn = new Int32Array(592)),
        (e.sane = 1),
        (e.back = -1),
        he
      );
    },
    Re = (t) => {
      if (Ae(t)) return fe;
      const e = t.state;
      return (e.wsize = 0), (e.whave = 0), (e.wnext = 0), Ee(t);
    },
    Ze = (t, e) => {
      let a;
      if (Ae(t)) return fe;
      const i = t.state;
      return (
        e < 0 ? ((a = 0), (e = -e)) : ((a = 5 + (e >> 4)), e < 48 && (e &= 15)),
        e && (e < 8 || 15 < e)
          ? fe
          : (null !== i.window && i.wbits !== e && (i.window = null),
            (i.wrap = a),
            (i.wbits = e),
            Re(t))
      );
    },
    Ue = (t, e) => {
      if (!t) return fe;
      const a = new ze();
      (t.state = a), (a.strm = t), (a.window = null), (a.mode = be);
      e = Ze(t, e);
      return e !== he && (t.state = null), e;
    };
  let Se = !0,
    De,
    Te;
  var Oe = (t, e, a, i) => {
      let n;
      const r = t.state;
      return (
        null === r.window &&
          ((r.wsize = 1 << r.wbits),
          (r.wnext = 0),
          (r.whave = 0),
          (r.window = new Uint8Array(r.wsize))),
        i >= r.wsize
          ? (r.window.set(e.subarray(a - r.wsize, a), 0),
            (r.wnext = 0),
            (r.whave = r.wsize))
          : ((n = r.wsize - r.wnext),
            n > i && (n = i),
            r.window.set(e.subarray(a - i, a - i + n), r.wnext),
            (i -= n)
              ? (r.window.set(e.subarray(a - i, a), 0),
                (r.wnext = i),
                (r.whave = r.wsize))
              : ((r.wnext += n),
                r.wnext === r.wsize && (r.wnext = 0),
                r.whave < r.wsize && (r.whave += n))),
        0
      );
    },
    Ie = {
      inflateReset: Re,
      inflateReset2: Ze,
      inflateResetKeep: Ee,
      inflateInit: (t) => Ue(t, 15),
      inflateInit2: Ue,
      inflate: (t, e) => {
        let a,
          i,
          n,
          r,
          s,
          o,
          l,
          h,
          d,
          _,
          f,
          u,
          c,
          w,
          m = 0,
          b,
          g,
          p,
          k,
          v,
          y,
          x,
          z;
        const A = new Uint8Array(4);
        let E, R;
        var Z = new Uint8Array([
          16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
        ]);
        if (Ae(t) || !t.output || (!t.input && 0 !== t.avail_in)) return fe;
        (a = t.state),
          a.mode === pe && (a.mode = 16192),
          (s = t.next_out),
          (n = t.output),
          (l = t.avail_out),
          (r = t.next_in),
          (i = t.input),
          (o = t.avail_in),
          (h = a.hold),
          (d = a.bits),
          (_ = o),
          (f = l),
          (z = he);
        t: for (;;)
          switch (a.mode) {
            case be:
              if (0 === a.wrap) {
                a.mode = 16192;
                break;
              }
              for (; d < 16; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              if (2 & a.wrap && 35615 === h) {
                0 === a.wbits && (a.wbits = 15),
                  (a.check = 0),
                  (A[0] = 255 & h),
                  (A[1] = (h >>> 8) & 255),
                  (a.check = M(a.check, A, 2, 0)),
                  (h = 0),
                  (d = 0),
                  (a.mode = 16181);
                break;
              }
              if (
                (a.head && (a.head.done = !1),
                !(1 & a.wrap) || (((255 & h) << 8) + (h >> 8)) % 31)
              ) {
                (t.msg = "incorrect header check"), (a.mode = ye);
                break;
              }
              if ((15 & h) !== me) {
                (t.msg = "unknown compression method"), (a.mode = ye);
                break;
              }
              if (
                ((h >>>= 4),
                (d -= 4),
                (x = 8 + (15 & h)),
                0 === a.wbits && (a.wbits = x),
                15 < x || x > a.wbits)
              ) {
                (t.msg = "invalid window size"), (a.mode = ye);
                break;
              }
              (a.dmax = 1 << a.wbits),
                (a.flags = 0),
                (t.adler = a.check = 1),
                (a.mode = 512 & h ? 16189 : pe),
                (h = 0),
                (d = 0);
              break;
            case 16181:
              for (; d < 16; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              if (((a.flags = h), (255 & a.flags) !== me)) {
                (t.msg = "unknown compression method"), (a.mode = ye);
                break;
              }
              if (57344 & a.flags) {
                (t.msg = "unknown header flags set"), (a.mode = ye);
                break;
              }
              a.head && (a.head.text = (h >> 8) & 1),
                512 & a.flags &&
                  4 & a.wrap &&
                  ((A[0] = 255 & h),
                  (A[1] = (h >>> 8) & 255),
                  (a.check = M(a.check, A, 2, 0))),
                (h = 0),
                (d = 0),
                (a.mode = 16182);
            case 16182:
              for (; d < 32; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              a.head && (a.head.time = h),
                512 & a.flags &&
                  4 & a.wrap &&
                  ((A[0] = 255 & h),
                  (A[1] = (h >>> 8) & 255),
                  (A[2] = (h >>> 16) & 255),
                  (A[3] = (h >>> 24) & 255),
                  (a.check = M(a.check, A, 4, 0))),
                (h = 0),
                (d = 0),
                (a.mode = 16183);
            case 16183:
              for (; d < 16; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              a.head && ((a.head.xflags = 255 & h), (a.head.os = h >> 8)),
                512 & a.flags &&
                  4 & a.wrap &&
                  ((A[0] = 255 & h),
                  (A[1] = (h >>> 8) & 255),
                  (a.check = M(a.check, A, 2, 0))),
                (h = 0),
                (d = 0),
                (a.mode = 16184);
            case 16184:
              if (1024 & a.flags) {
                for (; d < 16; ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                (a.length = h),
                  a.head && (a.head.extra_len = h),
                  512 & a.flags &&
                    4 & a.wrap &&
                    ((A[0] = 255 & h),
                    (A[1] = (h >>> 8) & 255),
                    (a.check = M(a.check, A, 2, 0))),
                  (h = 0),
                  (d = 0);
              } else a.head && (a.head.extra = null);
              a.mode = 16185;
            case 16185:
              if (
                1024 & a.flags &&
                ((u = a.length),
                u > o && (u = o),
                u &&
                  (a.head &&
                    ((x = a.head.extra_len - a.length),
                    a.head.extra ||
                      (a.head.extra = new Uint8Array(a.head.extra_len)),
                    a.head.extra.set(i.subarray(r, r + u), x)),
                  512 & a.flags &&
                    4 & a.wrap &&
                    (a.check = M(a.check, i, u, r)),
                  (o -= u),
                  (r += u),
                  (a.length -= u)),
                a.length)
              )
                break t;
              (a.length = 0), (a.mode = 16186);
            case 16186:
              if (2048 & a.flags) {
                if (0 === o) break t;
                for (
                  u = 0;
                  (x = i[r + u++]),
                    a.head &&
                      x &&
                      a.length < 65536 &&
                      (a.head.name += String.fromCharCode(x)),
                    x && u < o;

                );
                if (
                  (512 & a.flags &&
                    4 & a.wrap &&
                    (a.check = M(a.check, i, u, r)),
                  (o -= u),
                  (r += u),
                  x)
                )
                  break t;
              } else a.head && (a.head.name = null);
              (a.length = 0), (a.mode = 16187);
            case 16187:
              if (4096 & a.flags) {
                if (0 === o) break t;
                for (
                  u = 0;
                  (x = i[r + u++]),
                    a.head &&
                      x &&
                      a.length < 65536 &&
                      (a.head.comment += String.fromCharCode(x)),
                    x && u < o;

                );
                if (
                  (512 & a.flags &&
                    4 & a.wrap &&
                    (a.check = M(a.check, i, u, r)),
                  (o -= u),
                  (r += u),
                  x)
                )
                  break t;
              } else a.head && (a.head.comment = null);
              a.mode = 16188;
            case 16188:
              if (512 & a.flags) {
                for (; d < 16; ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                if (4 & a.wrap && h !== (65535 & a.check)) {
                  (t.msg = "header crc mismatch"), (a.mode = ye);
                  break;
                }
                (h = 0), (d = 0);
              }
              a.head &&
                ((a.head.hcrc = (a.flags >> 9) & 1), (a.head.done = !0)),
                (t.adler = a.check = 0),
                (a.mode = pe);
              break;
            case 16189:
              for (; d < 32; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              (t.adler = a.check = xe(h)), (h = 0), (d = 0), (a.mode = ge);
            case ge:
              if (0 === a.havedict)
                return (
                  (t.next_out = s),
                  (t.avail_out = l),
                  (t.next_in = r),
                  (t.avail_in = o),
                  (a.hold = h),
                  (a.bits = d),
                  _e
                );
              (t.adler = a.check = 1), (a.mode = pe);
            case pe:
              if (e === oe || e === le) break t;
            case 16192:
              if (a.last) {
                (h >>>= 7 & d), (d -= 7 & d), (a.mode = 16206);
                break;
              }
              for (; d < 3; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              switch (((a.last = 1 & h), (h >>>= 1), --d, 3 & h)) {
                case 0:
                  a.mode = 16193;
                  break;
                case 1:
                  if (
                    (((e) => {
                      if (Se) {
                        (De = new Int32Array(512)), (Te = new Int32Array(32));
                        let t = 0;
                        for (; t < 144; ) e.lens[t++] = 8;
                        for (; t < 256; ) e.lens[t++] = 9;
                        for (; t < 280; ) e.lens[t++] = 7;
                        for (; t < 288; ) e.lens[t++] = 8;
                        for (
                          re(1, e.lens, 0, 288, De, 0, e.work, { bits: 9 }),
                            t = 0;
                          t < 32;

                        )
                          e.lens[t++] = 5;
                        re(2, e.lens, 0, 32, Te, 0, e.work, { bits: 5 }),
                          (Se = !1);
                      }
                      (e.lencode = De),
                        (e.lenbits = 9),
                        (e.distcode = Te),
                        (e.distbits = 5);
                    })(a),
                    (a.mode = ke),
                    e !== le)
                  )
                    break;
                  (h >>>= 2), (d -= 2);
                  break t;
                case 2:
                  a.mode = 16196;
                  break;
                case 3:
                  (t.msg = "invalid block type"), (a.mode = ye);
              }
              (h >>>= 2), (d -= 2);
              break;
            case 16193:
              for (h >>>= 7 & d, d -= 7 & d; d < 32; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              if ((65535 & h) != ((h >>> 16) ^ 65535)) {
                (t.msg = "invalid stored block lengths"), (a.mode = ye);
                break;
              }
              if (
                ((a.length = 65535 & h),
                (h = 0),
                (d = 0),
                (a.mode = 16194),
                e === le)
              )
                break t;
            case 16194:
              a.mode = 16195;
            case 16195:
              if (((u = a.length), u)) {
                if ((u > o && (u = o), u > l && (u = l), 0 === u)) break t;
                n.set(i.subarray(r, r + u), s),
                  (o -= u),
                  (r += u),
                  (l -= u),
                  (s += u),
                  (a.length -= u);
                break;
              }
              a.mode = pe;
              break;
            case 16196:
              for (; d < 14; ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              if (
                ((a.nlen = 257 + (31 & h)),
                (h >>>= 5),
                (d -= 5),
                (a.ndist = 1 + (31 & h)),
                (h >>>= 5),
                (d -= 5),
                (a.ncode = 4 + (15 & h)),
                (h >>>= 4),
                (d -= 4),
                286 < a.nlen || 30 < a.ndist)
              ) {
                (t.msg = "too many length or distance symbols"), (a.mode = ye);
                break;
              }
              (a.have = 0), (a.mode = 16197);
            case 16197:
              for (; a.have < a.ncode; ) {
                for (; d < 3; ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                (a.lens[Z[a.have++]] = 7 & h), (h >>>= 3), (d -= 3);
              }
              for (; a.have < 19; ) a.lens[Z[a.have++]] = 0;
              if (
                ((a.lencode = a.lendyn),
                (a.lenbits = 7),
                (E = { bits: a.lenbits }),
                (z = re(0, a.lens, 0, 19, a.lencode, 0, a.work, E)),
                (a.lenbits = E.bits),
                z)
              ) {
                (t.msg = "invalid code lengths set"), (a.mode = ye);
                break;
              }
              (a.have = 0), (a.mode = 16198);
            case 16198:
              for (; a.have < a.nlen + a.ndist; ) {
                for (
                  ;
                  (m = a.lencode[h & ((1 << a.lenbits) - 1)]),
                    (b = m >>> 24),
                    (g = (m >>> 16) & 255),
                    (p = 65535 & m),
                    !(b <= d);

                ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                if (p < 16) (h >>>= b), (d -= b), (a.lens[a.have++] = p);
                else {
                  if (16 === p) {
                    for (R = b + 2; d < R; ) {
                      if (0 === o) break t;
                      o--, (h += i[r++] << d), (d += 8);
                    }
                    if (((h >>>= b), (d -= b), 0 === a.have)) {
                      (t.msg = "invalid bit length repeat"), (a.mode = ye);
                      break;
                    }
                    (x = a.lens[a.have - 1]),
                      (u = 3 + (3 & h)),
                      (h >>>= 2),
                      (d -= 2);
                  } else if (17 === p) {
                    for (R = b + 3; d < R; ) {
                      if (0 === o) break t;
                      o--, (h += i[r++] << d), (d += 8);
                    }
                    (h >>>= b),
                      (d -= b),
                      (x = 0),
                      (u = 3 + (7 & h)),
                      (h >>>= 3),
                      (d -= 3);
                  } else {
                    for (R = b + 7; d < R; ) {
                      if (0 === o) break t;
                      o--, (h += i[r++] << d), (d += 8);
                    }
                    (h >>>= b),
                      (d -= b),
                      (x = 0),
                      (u = 11 + (127 & h)),
                      (h >>>= 7),
                      (d -= 7);
                  }
                  if (a.have + u > a.nlen + a.ndist) {
                    (t.msg = "invalid bit length repeat"), (a.mode = ye);
                    break;
                  }
                  for (; u--; ) a.lens[a.have++] = x;
                }
              }
              if (a.mode === ye) break;
              if (0 === a.lens[256]) {
                (t.msg = "invalid code -- missing end-of-block"), (a.mode = ye);
                break;
              }
              if (
                ((a.lenbits = 9),
                (E = { bits: a.lenbits }),
                (z = re(1, a.lens, 0, a.nlen, a.lencode, 0, a.work, E)),
                (a.lenbits = E.bits),
                z)
              ) {
                (t.msg = "invalid literal/lengths set"), (a.mode = ye);
                break;
              }
              if (
                ((a.distbits = 6),
                (a.distcode = a.distdyn),
                (E = { bits: a.distbits }),
                (z = re(2, a.lens, a.nlen, a.ndist, a.distcode, 0, a.work, E)),
                (a.distbits = E.bits),
                z)
              ) {
                (t.msg = "invalid distances set"), (a.mode = ye);
                break;
              }
              if (((a.mode = ke), e === le)) break t;
            case ke:
              a.mode = ve;
            case ve:
              if (6 <= o && 258 <= l) {
                (t.next_out = s),
                  (t.avail_out = l),
                  (t.next_in = r),
                  (t.avail_in = o),
                  (a.hold = h),
                  (a.bits = d),
                  (function (t, e) {
                    let a,
                      i,
                      n,
                      r,
                      s,
                      o,
                      l,
                      h,
                      d,
                      _,
                      f,
                      u,
                      c,
                      w,
                      m,
                      b,
                      g,
                      p,
                      k,
                      v,
                      y,
                      x,
                      z,
                      A;
                    const E = t.state;
                    (a = t.next_in),
                      (z = t.input),
                      (i = a + (t.avail_in - 5)),
                      (n = t.next_out),
                      (A = t.output),
                      (r = n - (e - t.avail_out)),
                      (s = n + (t.avail_out - 257)),
                      (o = E.dmax),
                      (l = E.wsize),
                      (h = E.whave),
                      (d = E.wnext),
                      (_ = E.window),
                      (f = E.hold),
                      (u = E.bits),
                      (c = E.lencode),
                      (w = E.distcode),
                      (m = (1 << E.lenbits) - 1),
                      (b = (1 << E.distbits) - 1);
                    e: do {
                      u < 15 &&
                        ((f += z[a++] << u),
                        (u += 8),
                        (f += z[a++] << u),
                        (u += 8)),
                        (g = c[f & m]);
                      a: for (;;) {
                        if (
                          ((p = g >>> 24),
                          (f >>>= p),
                          (u -= p),
                          (p = (g >>> 16) & 255),
                          0 === p)
                        )
                          A[n++] = 65535 & g;
                        else {
                          if (!(16 & p)) {
                            if (0 == (64 & p)) {
                              g = c[(65535 & g) + (f & ((1 << p) - 1))];
                              continue a;
                            }
                            if (32 & p) {
                              E.mode = 16191;
                              break e;
                            }
                            (t.msg = "invalid literal/length code"),
                              (E.mode = te);
                            break e;
                          }
                          (k = 65535 & g),
                            (p &= 15),
                            p &&
                              (u < p && ((f += z[a++] << u), (u += 8)),
                              (k += f & ((1 << p) - 1)),
                              (f >>>= p),
                              (u -= p)),
                            u < 15 &&
                              ((f += z[a++] << u),
                              (u += 8),
                              (f += z[a++] << u),
                              (u += 8)),
                            (g = w[f & b]);
                          i: for (;;) {
                            if (
                              ((p = g >>> 24),
                              (f >>>= p),
                              (u -= p),
                              (p = (g >>> 16) & 255),
                              !(16 & p))
                            ) {
                              if (0 == (64 & p)) {
                                g = w[(65535 & g) + (f & ((1 << p) - 1))];
                                continue i;
                              }
                              (t.msg = "invalid distance code"), (E.mode = te);
                              break e;
                            }
                            if (
                              ((v = 65535 & g),
                              (p &= 15),
                              u < p &&
                                ((f += z[a++] << u),
                                (u += 8),
                                u < p && ((f += z[a++] << u), (u += 8))),
                              (v += f & ((1 << p) - 1)),
                              v > o)
                            ) {
                              (t.msg = "invalid distance too far back"),
                                (E.mode = te);
                              break e;
                            }
                            if (((f >>>= p), (u -= p), (p = n - r), v > p)) {
                              if (((p = v - p), p > h && E.sane)) {
                                (t.msg = "invalid distance too far back"),
                                  (E.mode = te);
                                break e;
                              }
                              if (((y = 0), (x = _), 0 === d)) {
                                if (((y += l - p), p < k)) {
                                  for (k -= p; (A[n++] = _[y++]), --p; );
                                  (y = n - v), (x = A);
                                }
                              } else if (d < p) {
                                if (((y += l + d - p), (p -= d), p < k)) {
                                  for (k -= p; (A[n++] = _[y++]), --p; );
                                  if (((y = 0), d < k)) {
                                    for (
                                      p = d, k -= p;
                                      (A[n++] = _[y++]), --p;

                                    );
                                    (y = n - v), (x = A);
                                  }
                                }
                              } else if (((y += d - p), p < k)) {
                                for (k -= p; (A[n++] = _[y++]), --p; );
                                (y = n - v), (x = A);
                              }
                              for (; 2 < k; )
                                (A[n++] = x[y++]),
                                  (A[n++] = x[y++]),
                                  (A[n++] = x[y++]),
                                  (k -= 3);
                              k &&
                                ((A[n++] = x[y++]), 1 < k && (A[n++] = x[y++]));
                            } else {
                              for (
                                y = n - v;
                                (A[n++] = A[y++]),
                                  (A[n++] = A[y++]),
                                  (A[n++] = A[y++]),
                                  (k -= 3),
                                  2 < k;

                              );
                              k &&
                                ((A[n++] = A[y++]), 1 < k && (A[n++] = A[y++]));
                            }
                            break;
                          }
                        }
                        break;
                      }
                    } while (a < i && n < s);
                    (k = u >> 3),
                      (a -= k),
                      (u -= k << 3),
                      (f &= (1 << u) - 1),
                      (t.next_in = a),
                      (t.next_out = n),
                      (t.avail_in = a < i ? i - a + 5 : 5 - (a - i)),
                      (t.avail_out = n < s ? s - n + 257 : 257 - (n - s)),
                      (E.hold = f),
                      (E.bits = u);
                  })(t, f),
                  (s = t.next_out),
                  (n = t.output),
                  (l = t.avail_out),
                  (r = t.next_in),
                  (i = t.input),
                  (o = t.avail_in),
                  (h = a.hold),
                  (d = a.bits),
                  a.mode === pe && (a.back = -1);
                break;
              }
              for (
                a.back = 0;
                (m = a.lencode[h & ((1 << a.lenbits) - 1)]),
                  (b = m >>> 24),
                  (g = (m >>> 16) & 255),
                  (p = 65535 & m),
                  !(b <= d);

              ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              if (g && 0 == (240 & g)) {
                for (
                  k = b, v = g, y = p;
                  (m = a.lencode[y + ((h & ((1 << (k + v)) - 1)) >> k)]),
                    (b = m >>> 24),
                    (g = (m >>> 16) & 255),
                    (p = 65535 & m),
                    !(k + b <= d);

                ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                (h >>>= k), (d -= k), (a.back += k);
              }
              if (
                ((h >>>= b), (d -= b), (a.back += b), (a.length = p), 0 === g)
              ) {
                a.mode = 16205;
                break;
              }
              if (32 & g) {
                (a.back = -1), (a.mode = pe);
                break;
              }
              if (64 & g) {
                (t.msg = "invalid literal/length code"), (a.mode = ye);
                break;
              }
              (a.extra = 15 & g), (a.mode = 16201);
            case 16201:
              if (a.extra) {
                for (R = a.extra; d < R; ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                (a.length += h & ((1 << a.extra) - 1)),
                  (h >>>= a.extra),
                  (d -= a.extra),
                  (a.back += a.extra);
              }
              (a.was = a.length), (a.mode = 16202);
            case 16202:
              for (
                ;
                (m = a.distcode[h & ((1 << a.distbits) - 1)]),
                  (b = m >>> 24),
                  (g = (m >>> 16) & 255),
                  (p = 65535 & m),
                  !(b <= d);

              ) {
                if (0 === o) break t;
                o--, (h += i[r++] << d), (d += 8);
              }
              if (0 == (240 & g)) {
                for (
                  k = b, v = g, y = p;
                  (m = a.distcode[y + ((h & ((1 << (k + v)) - 1)) >> k)]),
                    (b = m >>> 24),
                    (g = (m >>> 16) & 255),
                    (p = 65535 & m),
                    !(k + b <= d);

                ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                (h >>>= k), (d -= k), (a.back += k);
              }
              if (((h >>>= b), (d -= b), (a.back += b), 64 & g)) {
                (t.msg = "invalid distance code"), (a.mode = ye);
                break;
              }
              (a.offset = p), (a.extra = 15 & g), (a.mode = 16203);
            case 16203:
              if (a.extra) {
                for (R = a.extra; d < R; ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                (a.offset += h & ((1 << a.extra) - 1)),
                  (h >>>= a.extra),
                  (d -= a.extra),
                  (a.back += a.extra);
              }
              if (a.offset > a.dmax) {
                (t.msg = "invalid distance too far back"), (a.mode = ye);
                break;
              }
              a.mode = 16204;
            case 16204:
              if (0 === l) break t;
              if (((u = f - l), a.offset > u)) {
                if (((u = a.offset - u), u > a.whave && a.sane)) {
                  (t.msg = "invalid distance too far back"), (a.mode = ye);
                  break;
                }
                (c = u > a.wnext ? ((u -= a.wnext), a.wsize - u) : a.wnext - u),
                  u > a.length && (u = a.length),
                  (w = a.window);
              } else (w = n), (c = s - a.offset), (u = a.length);
              for (
                u > l && (u = l), l -= u, a.length -= u;
                (n[s++] = w[c++]), --u;

              );
              0 === a.length && (a.mode = ve);
              break;
            case 16205:
              if (0 === l) break t;
              (n[s++] = a.length), l--, (a.mode = ve);
              break;
            case 16206:
              if (a.wrap) {
                for (; d < 32; ) {
                  if (0 === o) break t;
                  o--, (h |= i[r++] << d), (d += 8);
                }
                if (
                  ((f -= l),
                  (t.total_out += f),
                  (a.total += f),
                  4 & a.wrap &&
                    f &&
                    (t.adler = a.check =
                      (a.flags ? M : B)(a.check, n, f, s - f)),
                  (f = l),
                  4 & a.wrap && (a.flags ? h : xe(h)) !== a.check)
                ) {
                  (t.msg = "incorrect data check"), (a.mode = ye);
                  break;
                }
                (h = 0), (d = 0);
              }
              a.mode = 16207;
            case 16207:
              if (a.wrap && a.flags) {
                for (; d < 32; ) {
                  if (0 === o) break t;
                  o--, (h += i[r++] << d), (d += 8);
                }
                if (4 & a.wrap && h !== (4294967295 & a.total)) {
                  (t.msg = "incorrect length check"), (a.mode = ye);
                  break;
                }
                (h = 0), (d = 0);
              }
              a.mode = 16208;
            case 16208:
              z = de;
              break t;
            case ye:
              z = ue;
              break t;
            case 16210:
              return ce;
            case 16211:
            default:
              return fe;
          }
        return (
          (t.next_out = s),
          (t.avail_out = l),
          (t.next_in = r),
          (t.avail_in = o),
          (a.hold = h),
          (a.bits = d),
          (a.wsize ||
            (f !== t.avail_out &&
              a.mode < ye &&
              (a.mode < 16206 || e !== se))) &&
            Oe(t, t.output, t.next_out, f - t.avail_out),
          (_ -= t.avail_in),
          (f -= t.avail_out),
          (t.total_in += _),
          (t.total_out += f),
          (a.total += f),
          4 & a.wrap &&
            f &&
            (t.adler = a.check =
              (a.flags ? M : B)(a.check, n, f, t.next_out - f)),
          (t.data_type =
            a.bits +
            (a.last ? 64 : 0) +
            (a.mode === pe ? 128 : 0) +
            (a.mode === ke || 16194 === a.mode ? 256 : 0)),
          ((0 === _ && 0 === f) || e === se) && z === he && (z = we),
          z
        );
      },
      inflateEnd: (t) => {
        if (Ae(t)) return fe;
        let e = t.state;
        return e.window && (e.window = null), (t.state = null), he;
      },
      inflateGetHeader: (t, e) => {
        if (Ae(t)) return fe;
        const a = t.state;
        return 0 == (2 & a.wrap) ? fe : (((a.head = e).done = !1), he);
      },
      inflateSetDictionary: (t, e) => {
        var a = e.length;
        let i, n, r;
        return Ae(t)
          ? fe
          : ((i = t.state),
            0 !== i.wrap && i.mode !== ge
              ? fe
              : i.mode === ge && ((n = 1), (n = B(n, e, a, 0)), n !== i.check)
                ? ue
                : ((r = Oe(t, e, a, a)),
                  r ? ((i.mode = 16210), ce) : ((i.havedict = 1), he)));
      },
      inflateInfo: "pako inflate (from Nodeca project)",
    };
  var Fe = function () {
    (this.text = 0),
      (this.time = 0),
      (this.xflags = 0),
      (this.os = 0),
      (this.extra = null),
      (this.extra_len = 0),
      (this.name = ""),
      (this.comment = ""),
      (this.hcrc = 0),
      (this.done = !1);
  };
  const Le = Object.prototype.toString,
    {
      Z_NO_FLUSH: Ne,
      Z_FINISH: Be,
      Z_OK: Ce,
      Z_STREAM_END: Me,
      Z_NEED_DICT: He,
      Z_STREAM_ERROR: je,
      Z_DATA_ERROR: Ke,
      Z_MEM_ERROR: Pe,
    } = j;
  function Ye(t) {
    this.options = Lt.assign(
      { chunkSize: 65536, windowBits: 15, to: "" },
      t || {},
    );
    const e = this.options;
    e.raw &&
      0 <= e.windowBits &&
      e.windowBits < 16 &&
      ((e.windowBits = -e.windowBits),
      0 === e.windowBits && (e.windowBits = -15)),
      !(0 <= e.windowBits && e.windowBits < 16) ||
        (t && t.windowBits) ||
        (e.windowBits += 32),
      15 < e.windowBits &&
        e.windowBits < 48 &&
        0 == (15 & e.windowBits) &&
        (e.windowBits |= 15),
      (this.err = 0),
      (this.msg = ""),
      (this.ended = !1),
      (this.chunks = []),
      (this.strm = new Mt()),
      (this.strm.avail_out = 0);
    let a = Ie.inflateInit2(this.strm, e.windowBits);
    if (a !== Ce) throw new Error(H[a]);
    if (
      ((this.header = new Fe()),
      Ie.inflateGetHeader(this.strm, this.header),
      e.dictionary &&
        ("string" == typeof e.dictionary
          ? (e.dictionary = Ct.string2buf(e.dictionary))
          : "[object ArrayBuffer]" === Le.call(e.dictionary) &&
            (e.dictionary = new Uint8Array(e.dictionary)),
        e.raw &&
          ((a = Ie.inflateSetDictionary(this.strm, e.dictionary)), a !== Ce)))
    )
      throw new Error(H[a]);
  }
  function Ge(t, e) {
    const a = new Ye(e);
    if ((a.push(t), a.err)) throw a.msg || H[a.err];
    return a.result;
  }
  (Ye.prototype.push = function (t, e) {
    const a = this.strm;
    var i,
      n,
      r,
      s = this.options.chunkSize,
      o = this.options.dictionary;
    let l, h, d;
    if (this.ended) return !1;
    for (
      h = e === ~~e ? e : !0 === e ? Be : Ne,
        "[object ArrayBuffer]" === Le.call(t)
          ? (a.input = new Uint8Array(t))
          : (a.input = t),
        a.next_in = 0,
        a.avail_in = a.input.length;
      ;

    ) {
      for (
        0 === a.avail_out &&
          ((a.output = new Uint8Array(s)), (a.next_out = 0), (a.avail_out = s)),
          l = Ie.inflate(a, h),
          l === He &&
            o &&
            ((l = Ie.inflateSetDictionary(a, o)),
            l === Ce ? (l = Ie.inflate(a, h)) : l === Ke && (l = He));
        0 < a.avail_in && l === Me && 0 < a.state.wrap && 0 !== t[a.next_in];

      )
        Ie.inflateReset(a), (l = Ie.inflate(a, h));
      switch (l) {
        case je:
        case Ke:
        case He:
        case Pe:
          return this.onEnd(l), !(this.ended = !0);
      }
      if (
        ((d = a.avail_out),
        a.next_out &&
          ((0 !== a.avail_out && l !== Me) ||
            ("string" === this.options.to
              ? ((i = Ct.utf8border(a.output, a.next_out)),
                (n = a.next_out - i),
                (r = Ct.buf2string(a.output, i)),
                (a.next_out = n),
                (a.avail_out = s - n),
                n && a.output.set(a.output.subarray(i, i + n), 0),
                this.onData(r))
              : this.onData(
                  a.output.length === a.next_out
                    ? a.output
                    : a.output.subarray(0, a.next_out),
                ))),
        l !== Ce || 0 !== d)
      ) {
        if (l === Me)
          return (
            (l = Ie.inflateEnd(this.strm)), this.onEnd(l), (this.ended = !0)
          );
        if (0 === a.avail_in) break;
      }
    }
    return !0;
  }),
    (Ye.prototype.onData = function (t) {
      this.chunks.push(t);
    }),
    (Ye.prototype.onEnd = function (t) {
      t === Ce &&
        ("string" === this.options.to
          ? (this.result = this.chunks.join(""))
          : (this.result = Lt.flattenChunks(this.chunks))),
        (this.chunks = []),
        (this.err = t),
        (this.msg = this.strm.msg);
    });
  var { Deflate: Xe, deflate: We, deflateRaw: qe, gzip: Je } = $t,
    {
      Inflate: Qe,
      inflate: N,
      inflateRaw: Et,
      ungzip: Rt,
    } = {
      Inflate: Ye,
      inflate: Ge,
      inflateRaw: function (t, e) {
        return ((e = e || {}).raw = !0), Ge(t, e);
      },
      ungzip: Ge,
      constants: j,
    },
    $t = We,
    We = qe,
    qe = Je,
    Je = Qe,
    Qe = N,
    N = Et,
    Et = Rt,
    Rt = j,
    j = {
      Deflate: Xe,
      deflate: $t,
      deflateRaw: We,
      gzip: qe,
      Inflate: Je,
      inflate: Qe,
      inflateRaw: N,
      ungzip: Et,
      constants: Rt,
    };
  (t.Deflate = Xe),
    (t.Inflate = Je),
    (t.constants = Rt),
    (t.default = j),
    (t.deflate = $t),
    (t.deflateRaw = We),
    (t.gzip = qe),
    (t.inflate = Qe),
    (t.inflateRaw = N),
    (t.ungzip = Et),
    Object.defineProperty(t, "__esModule", { value: !0 });
});
