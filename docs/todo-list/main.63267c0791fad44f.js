"use strict";
(self.webpackChunktodo_list = self.webpackChunktodo_list || []).push([
  [179],
  {
    352: () => {
      function ne(e) {
        return "function" == typeof e;
      }
      function To(e) {
        const t = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (t.prototype = Object.create(Error.prototype)),
          (t.prototype.constructor = t),
          t
        );
      }
      const ls = To(
        (e) =>
          function (t) {
            e(this),
              (this.message = t
                ? `${t.length} errors occurred during unsubscription:\n${t
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = t);
          }
      );
      function No(e, n) {
        if (e) {
          const t = e.indexOf(n);
          0 <= t && e.splice(t, 1);
        }
      }
      class st {
        constructor(n) {
          (this.initialTeardown = n),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let n;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: t } = this;
            if (t)
              if (((this._parentage = null), Array.isArray(t)))
                for (const i of t) i.remove(this);
              else t.remove(this);
            const { initialTeardown: r } = this;
            if (ne(r))
              try {
                r();
              } catch (i) {
                n = i instanceof ls ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  yh(i);
                } catch (s) {
                  (n = n ?? []),
                    s instanceof ls ? (n = [...n, ...s.errors]) : n.push(s);
                }
            }
            if (n) throw new ls(n);
          }
        }
        add(n) {
          var t;
          if (n && n !== this)
            if (this.closed) yh(n);
            else {
              if (n instanceof st) {
                if (n.closed || n._hasParent(this)) return;
                n._addParent(this);
              }
              (this._finalizers =
                null !== (t = this._finalizers) && void 0 !== t ? t : []).push(
                n
              );
            }
        }
        _hasParent(n) {
          const { _parentage: t } = this;
          return t === n || (Array.isArray(t) && t.includes(n));
        }
        _addParent(n) {
          const { _parentage: t } = this;
          this._parentage = Array.isArray(t) ? (t.push(n), t) : t ? [t, n] : n;
        }
        _removeParent(n) {
          const { _parentage: t } = this;
          t === n ? (this._parentage = null) : Array.isArray(t) && No(t, n);
        }
        remove(n) {
          const { _finalizers: t } = this;
          t && No(t, n), n instanceof st && n._removeParent(this);
        }
      }
      st.EMPTY = (() => {
        const e = new st();
        return (e.closed = !0), e;
      })();
      const gh = st.EMPTY;
      function mh(e) {
        return (
          e instanceof st ||
          (e && "closed" in e && ne(e.remove) && ne(e.add) && ne(e.unsubscribe))
        );
      }
      function yh(e) {
        ne(e) ? e() : e.unsubscribe();
      }
      const Gn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        ds = {
          setTimeout(e, n, ...t) {
            const { delegate: r } = ds;
            return r?.setTimeout
              ? r.setTimeout(e, n, ...t)
              : setTimeout(e, n, ...t);
          },
          clearTimeout(e) {
            const { delegate: n } = ds;
            return (n?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function vh(e) {
        ds.setTimeout(() => {
          const { onUnhandledError: n } = Gn;
          if (!n) throw e;
          n(e);
        });
      }
      function Bu() {}
      const vb = Hu("C", void 0, void 0);
      function Hu(e, n, t) {
        return { kind: e, value: n, error: t };
      }
      let qn = null;
      function fs(e) {
        if (Gn.useDeprecatedSynchronousErrorHandling) {
          const n = !qn;
          if ((n && (qn = { errorThrown: !1, error: null }), e(), n)) {
            const { errorThrown: t, error: r } = qn;
            if (((qn = null), t)) throw r;
          }
        } else e();
      }
      class $u extends st {
        constructor(n) {
          super(),
            (this.isStopped = !1),
            n
              ? ((this.destination = n), mh(n) && n.add(this))
              : (this.destination = Ib);
        }
        static create(n, t, r) {
          return new Ro(n, t, r);
        }
        next(n) {
          this.isStopped
            ? zu(
                (function _b(e) {
                  return Hu("N", e, void 0);
                })(n),
                this
              )
            : this._next(n);
        }
        error(n) {
          this.isStopped
            ? zu(
                (function Db(e) {
                  return Hu("E", void 0, e);
                })(n),
                this
              )
            : ((this.isStopped = !0), this._error(n));
        }
        complete() {
          this.isStopped
            ? zu(vb, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(n) {
          this.destination.next(n);
        }
        _error(n) {
          try {
            this.destination.error(n);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const wb = Function.prototype.bind;
      function Uu(e, n) {
        return wb.call(e, n);
      }
      class Eb {
        constructor(n) {
          this.partialObserver = n;
        }
        next(n) {
          const { partialObserver: t } = this;
          if (t.next)
            try {
              t.next(n);
            } catch (r) {
              hs(r);
            }
        }
        error(n) {
          const { partialObserver: t } = this;
          if (t.error)
            try {
              t.error(n);
            } catch (r) {
              hs(r);
            }
          else hs(n);
        }
        complete() {
          const { partialObserver: n } = this;
          if (n.complete)
            try {
              n.complete();
            } catch (t) {
              hs(t);
            }
        }
      }
      class Ro extends $u {
        constructor(n, t, r) {
          let o;
          if ((super(), ne(n) || !n))
            o = {
              next: n ?? void 0,
              error: t ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && Gn.useDeprecatedNextContext
              ? ((i = Object.create(n)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: n.next && Uu(n.next, i),
                  error: n.error && Uu(n.error, i),
                  complete: n.complete && Uu(n.complete, i),
                }))
              : (o = n);
          }
          this.destination = new Eb(o);
        }
      }
      function hs(e) {
        Gn.useDeprecatedSynchronousErrorHandling
          ? (function Cb(e) {
              Gn.useDeprecatedSynchronousErrorHandling &&
                qn &&
                ((qn.errorThrown = !0), (qn.error = e));
            })(e)
          : vh(e);
      }
      function zu(e, n) {
        const { onStoppedNotification: t } = Gn;
        t && ds.setTimeout(() => t(e, n));
      }
      const Ib = {
          closed: !0,
          next: Bu,
          error: function bb(e) {
            throw e;
          },
          complete: Bu,
        },
        Gu =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function bn(e) {
        return e;
      }
      function Dh(e) {
        return 0 === e.length
          ? bn
          : 1 === e.length
          ? e[0]
          : function (t) {
              return e.reduce((r, o) => o(r), t);
            };
      }
      let me = (() => {
        class e {
          constructor(t) {
            t && (this._subscribe = t);
          }
          lift(t) {
            const r = new e();
            return (r.source = this), (r.operator = t), r;
          }
          subscribe(t, r, o) {
            const i = (function Ab(e) {
              return (
                (e && e instanceof $u) ||
                ((function Sb(e) {
                  return e && ne(e.next) && ne(e.error) && ne(e.complete);
                })(e) &&
                  mh(e))
              );
            })(t)
              ? t
              : new Ro(t, r, o);
            return (
              fs(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(t) {
            try {
              return this._subscribe(t);
            } catch (r) {
              t.error(r);
            }
          }
          forEach(t, r) {
            return new (r = _h(r))((o, i) => {
              const s = new Ro({
                next: (a) => {
                  try {
                    t(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(t) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(t);
          }
          [Gu]() {
            return this;
          }
          pipe(...t) {
            return Dh(t)(this);
          }
          toPromise(t) {
            return new (t = _h(t))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (n) => new e(n)), e;
      })();
      function _h(e) {
        var n;
        return null !== (n = e ?? Gn.Promise) && void 0 !== n ? n : Promise;
      }
      const Tb = To(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let At = (() => {
        class e extends me {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(t) {
            const r = new Ch(this, this);
            return (r.operator = t), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new Tb();
          }
          next(t) {
            fs(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(t);
              }
            });
          }
          error(t) {
            fs(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = t);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(t);
              }
            });
          }
          complete() {
            fs(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: t } = this;
                for (; t.length; ) t.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var t;
            return (
              (null === (t = this.observers) || void 0 === t
                ? void 0
                : t.length) > 0
            );
          }
          _trySubscribe(t) {
            return this._throwIfClosed(), super._trySubscribe(t);
          }
          _subscribe(t) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(t),
              this._innerSubscribe(t)
            );
          }
          _innerSubscribe(t) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? gh
              : ((this.currentObservers = null),
                i.push(t),
                new st(() => {
                  (this.currentObservers = null), No(i, t);
                }));
          }
          _checkFinalizedStatuses(t) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? t.error(o) : i && t.complete();
          }
          asObservable() {
            const t = new me();
            return (t.source = this), t;
          }
        }
        return (e.create = (n, t) => new Ch(n, t)), e;
      })();
      class Ch extends At {
        constructor(n, t) {
          super(), (this.destination = n), (this.source = t);
        }
        next(n) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.next) ||
            void 0 === r ||
            r.call(t, n);
        }
        error(n) {
          var t, r;
          null ===
            (r =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.error) ||
            void 0 === r ||
            r.call(t, n);
        }
        complete() {
          var n, t;
          null ===
            (t =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.complete) ||
            void 0 === t ||
            t.call(n);
        }
        _subscribe(n) {
          var t, r;
          return null !==
            (r =
              null === (t = this.source) || void 0 === t
                ? void 0
                : t.subscribe(n)) && void 0 !== r
            ? r
            : gh;
        }
      }
      function wh(e) {
        return ne(e?.lift);
      }
      function Ee(e) {
        return (n) => {
          if (wh(n))
            return n.lift(function (t) {
              try {
                return e(t, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function _e(e, n, t, r, o) {
        return new Nb(e, n, t, r, o);
      }
      class Nb extends $u {
        constructor(n, t, r, o, i, s) {
          super(n),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = t
              ? function (a) {
                  try {
                    t(a);
                  } catch (u) {
                    n.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    n.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    n.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var n;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: t } = this;
            super.unsubscribe(),
              !t &&
                (null === (n = this.onFinalize) ||
                  void 0 === n ||
                  n.call(this));
          }
        }
      }
      function Z(e, n) {
        return Ee((t, r) => {
          let o = 0;
          t.subscribe(
            _e(r, (i) => {
              r.next(e.call(n, i, o++));
            })
          );
        });
      }
      function In(e) {
        return this instanceof In ? ((this.v = e), this) : new In(e);
      }
      function Mh(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var t,
          n = e[Symbol.asyncIterator];
        return n
          ? n.call(e)
          : ((e = (function Yu(e) {
              var n = "function" == typeof Symbol && Symbol.iterator,
                t = n && e[n],
                r = 0;
              if (t) return t.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                n
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (t = {}),
            r("next"),
            r("throw"),
            r("return"),
            (t[Symbol.asyncIterator] = function () {
              return this;
            }),
            t);
        function r(i) {
          t[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (c) {
                    i({ value: c, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const Sh = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Ah(e) {
        return ne(e?.then);
      }
      function Th(e) {
        return ne(e[Gu]);
      }
      function Nh(e) {
        return Symbol.asyncIterator && ne(e?.[Symbol.asyncIterator]);
      }
      function Rh(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const xh = (function Jb() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Oh(e) {
        return ne(e?.[xh]);
      }
      function Ph(e) {
        return (function Ih(e, n, t) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = t.apply(e, n || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function u(f) {
                f.value instanceof In
                  ? Promise.resolve(f.value.v).then(c, l)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function c(f) {
            a("next", f);
          }
          function l(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const t = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield In(t.read());
              if (o) return yield In(void 0);
              yield yield In(r);
            }
          } finally {
            t.releaseLock();
          }
        });
      }
      function Fh(e) {
        return ne(e?.getReader);
      }
      function at(e) {
        if (e instanceof me) return e;
        if (null != e) {
          if (Th(e))
            return (function Kb(e) {
              return new me((n) => {
                const t = e[Gu]();
                if (ne(t.subscribe)) return t.subscribe(n);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (Sh(e))
            return (function eI(e) {
              return new me((n) => {
                for (let t = 0; t < e.length && !n.closed; t++) n.next(e[t]);
                n.complete();
              });
            })(e);
          if (Ah(e))
            return (function tI(e) {
              return new me((n) => {
                e.then(
                  (t) => {
                    n.closed || (n.next(t), n.complete());
                  },
                  (t) => n.error(t)
                ).then(null, vh);
              });
            })(e);
          if (Nh(e)) return kh(e);
          if (Oh(e))
            return (function nI(e) {
              return new me((n) => {
                for (const t of e) if ((n.next(t), n.closed)) return;
                n.complete();
              });
            })(e);
          if (Fh(e))
            return (function rI(e) {
              return kh(Ph(e));
            })(e);
        }
        throw Rh(e);
      }
      function kh(e) {
        return new me((n) => {
          (function oI(e, n) {
            var t, r, o, i;
            return (function Eh(e, n, t, r) {
              return new (t || (t = Promise))(function (i, s) {
                function a(l) {
                  try {
                    c(r.next(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(l) {
                  try {
                    c(r.throw(l));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(l) {
                  l.done
                    ? i(l.value)
                    : (function o(i) {
                        return i instanceof t
                          ? i
                          : new t(function (s) {
                              s(i);
                            });
                      })(l.value).then(a, u);
                }
                c((r = r.apply(e, n || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (t = Mh(e); !(r = yield t.next()).done; )
                  if ((n.next(r.value), n.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = t.return) && (yield i.call(t));
                } finally {
                  if (o) throw o.error;
                }
              }
              n.complete();
            });
          })(e, n).catch((t) => n.error(t));
        });
      }
      function on(e, n, t, r = 0, o = !1) {
        const i = n.schedule(function () {
          t(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Te(e, n, t = 1 / 0) {
        return ne(n)
          ? Te((r, o) => Z((i, s) => n(r, i, o, s))(at(e(r, o))), t)
          : ("number" == typeof n && (t = n),
            Ee((r, o) =>
              (function iI(e, n, t, r, o, i, s, a) {
                const u = [];
                let c = 0,
                  l = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !c && n.complete();
                  },
                  h = (g) => (c < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && n.next(g), c++;
                    let y = !1;
                    at(t(g, l++)).subscribe(
                      _e(
                        n,
                        (_) => {
                          o?.(_), i ? h(_) : n.next(_);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (c--; u.length && c < r; ) {
                                const _ = u.shift();
                                s ? on(n, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              n.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    _e(n, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, t)
            ));
      }
      function mr(e = 1 / 0) {
        return Te(bn, e);
      }
      const Ht = new me((e) => e.complete());
      function Qu(e) {
        return e[e.length - 1];
      }
      function Lh(e) {
        return ne(Qu(e)) ? e.pop() : void 0;
      }
      function xo(e) {
        return (function aI(e) {
          return e && ne(e.schedule);
        })(Qu(e))
          ? e.pop()
          : void 0;
      }
      function Vh(e, n = 0) {
        return Ee((t, r) => {
          t.subscribe(
            _e(
              r,
              (o) => on(r, e, () => r.next(o), n),
              () => on(r, e, () => r.complete(), n),
              (o) => on(r, e, () => r.error(o), n)
            )
          );
        });
      }
      function jh(e, n = 0) {
        return Ee((t, r) => {
          r.add(e.schedule(() => t.subscribe(r), n));
        });
      }
      function Bh(e, n) {
        if (!e) throw new Error("Iterable cannot be null");
        return new me((t) => {
          on(t, n, () => {
            const r = e[Symbol.asyncIterator]();
            on(
              t,
              n,
              () => {
                r.next().then((o) => {
                  o.done ? t.complete() : t.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function be(e, n) {
        return n
          ? (function pI(e, n) {
              if (null != e) {
                if (Th(e))
                  return (function cI(e, n) {
                    return at(e).pipe(jh(n), Vh(n));
                  })(e, n);
                if (Sh(e))
                  return (function dI(e, n) {
                    return new me((t) => {
                      let r = 0;
                      return n.schedule(function () {
                        r === e.length
                          ? t.complete()
                          : (t.next(e[r++]), t.closed || this.schedule());
                      });
                    });
                  })(e, n);
                if (Ah(e))
                  return (function lI(e, n) {
                    return at(e).pipe(jh(n), Vh(n));
                  })(e, n);
                if (Nh(e)) return Bh(e, n);
                if (Oh(e))
                  return (function fI(e, n) {
                    return new me((t) => {
                      let r;
                      return (
                        on(t, n, () => {
                          (r = e[xh]()),
                            on(
                              t,
                              n,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void t.error(s);
                                }
                                i ? t.complete() : t.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ne(r?.return) && r.return()
                      );
                    });
                  })(e, n);
                if (Fh(e))
                  return (function hI(e, n) {
                    return Bh(Ph(e), n);
                  })(e, n);
              }
              throw Rh(e);
            })(e, n)
          : at(e);
      }
      class vt extends At {
        constructor(n) {
          super(), (this._value = n);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(n) {
          const t = super._subscribe(n);
          return !t.closed && n.next(this._value), t;
        }
        getValue() {
          const { hasError: n, thrownError: t, _value: r } = this;
          if (n) throw t;
          return this._throwIfClosed(), r;
        }
        next(n) {
          super.next((this._value = n));
        }
      }
      function R(...e) {
        return be(e, xo(e));
      }
      function Hh(e = {}) {
        const {
          connector: n = () => new At(),
          resetOnError: t = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: o = !0,
        } = e;
        return (i) => {
          let s,
            a,
            u,
            c = 0,
            l = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = u = void 0), (l = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return Ee((g, y) => {
            c++, !d && !l && f();
            const _ = (u = u ?? n());
            y.add(() => {
              c--, 0 === c && !d && !l && (a = Xu(p, o));
            }),
              _.subscribe(y),
              !s &&
                c > 0 &&
                ((s = new Ro({
                  next: (m) => _.next(m),
                  error: (m) => {
                    (d = !0), f(), (a = Xu(h, t, m)), _.error(m);
                  },
                  complete: () => {
                    (l = !0), f(), (a = Xu(h, r)), _.complete();
                  },
                })),
                at(g).subscribe(s));
          })(i);
        };
      }
      function Xu(e, n, ...t) {
        if (!0 === n) return void e();
        if (!1 === n) return;
        const r = new Ro({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return at(n(...t)).subscribe(r);
      }
      function Tt(e, n) {
        return Ee((t, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          t.subscribe(
            _e(
              r,
              (u) => {
                o?.unsubscribe();
                let c = 0;
                const l = i++;
                at(e(u, l)).subscribe(
                  (o = _e(
                    r,
                    (d) => r.next(n ? n(u, d, l, c++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function yI(e, n) {
        return e === n;
      }
      function J(e) {
        for (let n in e) if (e[n] === J) return n;
        throw Error("Could not find renamed property on target object.");
      }
      function ps(e, n) {
        for (const t in n)
          n.hasOwnProperty(t) && !e.hasOwnProperty(t) && (e[t] = n[t]);
      }
      function Ie(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Ie).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const n = e.toString();
        if (null == n) return "" + n;
        const t = n.indexOf("\n");
        return -1 === t ? n : n.substring(0, t);
      }
      function Ju(e, n) {
        return null == e || "" === e
          ? null === n
            ? ""
            : n
          : null == n || "" === n
          ? e
          : e + " " + n;
      }
      const vI = J({ __forward_ref__: J });
      function oe(e) {
        return (
          (e.__forward_ref__ = oe),
          (e.toString = function () {
            return Ie(this());
          }),
          e
        );
      }
      function P(e) {
        return Ku(e) ? e() : e;
      }
      function Ku(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(vI) &&
          e.__forward_ref__ === oe
        );
      }
      function ec(e) {
        return e && !!e.ɵproviders;
      }
      const $h = "https://g.co/ng/security#xss";
      class D extends Error {
        constructor(n, t) {
          super(
            (function gs(e, n) {
              return `NG0${Math.abs(e)}${n ? ": " + n : ""}`;
            })(n, t)
          ),
            (this.code = n);
        }
      }
      function k(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function tc(e, n) {
        throw new D(-201, !1);
      }
      function Dt(e, n) {
        null == e &&
          (function x(e, n, t, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${t} ${r} ${n} <=Actual]`)
            );
          })(n, e, null, "!=");
      }
      function S(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function $e(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function ms(e) {
        return Uh(e, vs) || Uh(e, zh);
      }
      function Uh(e, n) {
        return e.hasOwnProperty(n) ? e[n] : null;
      }
      function ys(e) {
        return e && (e.hasOwnProperty(nc) || e.hasOwnProperty(MI))
          ? e[nc]
          : null;
      }
      const vs = J({ ɵprov: J }),
        nc = J({ ɵinj: J }),
        zh = J({ ngInjectableDef: J }),
        MI = J({ ngInjectorDef: J });
      var $ = (function (e) {
        return (
          (e[(e.Default = 0)] = "Default"),
          (e[(e.Host = 1)] = "Host"),
          (e[(e.Self = 2)] = "Self"),
          (e[(e.SkipSelf = 4)] = "SkipSelf"),
          (e[(e.Optional = 8)] = "Optional"),
          e
        );
      })($ || {});
      let rc;
      function Ke(e) {
        const n = rc;
        return (rc = e), n;
      }
      function qh(e, n, t) {
        const r = ms(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : t & $.Optional
          ? null
          : void 0 !== n
          ? n
          : void tc(Ie(e));
      }
      const ie = globalThis;
      class I {
        constructor(n, t) {
          (this._desc = n),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof t
              ? (this.__NG_ELEMENT_ID__ = t)
              : void 0 !== t &&
                (this.ɵprov = S({
                  token: this,
                  providedIn: t.providedIn || "root",
                  factory: t.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const Oo = {},
        uc = "__NG_DI_FLAG__",
        Ds = "ngTempTokenPath",
        TI = /\n/gm,
        Zh = "__source";
      let yr;
      function Mn(e) {
        const n = yr;
        return (yr = e), n;
      }
      function xI(e, n = $.Default) {
        if (void 0 === yr) throw new D(-203, !1);
        return null === yr
          ? qh(e, void 0, n)
          : yr.get(e, n & $.Optional ? null : void 0, n);
      }
      function M(e, n = $.Default) {
        return (
          (function Gh() {
            return rc;
          })() || xI
        )(P(e), n);
      }
      function E(e, n = $.Default) {
        return M(e, _s(n));
      }
      function _s(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function cc(e) {
        const n = [];
        for (let t = 0; t < e.length; t++) {
          const r = P(e[t]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new D(900, !1);
            let o,
              i = $.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = OI(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            n.push(M(o, i));
          } else n.push(M(r));
        }
        return n;
      }
      function Po(e, n) {
        return (e[uc] = n), (e.prototype[uc] = n), e;
      }
      function OI(e) {
        return e[uc];
      }
      function sn(e) {
        return { toString: e }.toString();
      }
      var Cs = (function (e) {
          return (
            (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
          );
        })(Cs || {}),
        Nt = (function (e) {
          return (
            (e[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            e
          );
        })(Nt || {});
      const $t = {},
        W = [],
        ws = J({ ɵcmp: J }),
        lc = J({ ɵdir: J }),
        dc = J({ ɵpipe: J }),
        Qh = J({ ɵmod: J }),
        an = J({ ɵfac: J }),
        Fo = J({ __NG_ELEMENT_ID__: J }),
        Xh = J({ __NG_ENV_ID__: J });
      function Jh(e, n, t) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(n, t);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = n.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          t = o + 1;
        }
      }
      function fc(e, n, t) {
        let r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = t[r++],
              s = t[r++],
              a = t[r++];
            e.setAttribute(n, s, a, i);
          } else {
            const i = o,
              s = t[++r];
            ep(i) ? e.setProperty(n, i, s) : e.setAttribute(n, i, s), r++;
          }
        }
        return r;
      }
      function Kh(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function ep(e) {
        return 64 === e.charCodeAt(0);
      }
      function ko(e, n) {
        if (null !== n && 0 !== n.length)
          if (null === e || 0 === e.length) e = n.slice();
          else {
            let t = -1;
            for (let r = 0; r < n.length; r++) {
              const o = n[r];
              "number" == typeof o
                ? (t = o)
                : 0 === t ||
                  tp(e, t, o, null, -1 === t || 2 === t ? n[++r] : null);
            }
          }
        return e;
      }
      function tp(e, n, t, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === n) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === n) {
                s = -1;
                break;
              }
              if (a > n) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === t) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, n), (i = s + 1)),
          e.splice(i++, 0, t),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      const np = "ng-template";
      function kI(e, n, t) {
        let r = 0,
          o = !0;
        for (; r < e.length; ) {
          let i = e[r++];
          if ("string" == typeof i && o) {
            const s = e[r++];
            if (t && "class" === i && -1 !== Jh(s.toLowerCase(), n, 0))
              return !0;
          } else {
            if (1 === i) {
              for (; r < e.length && "string" == typeof (i = e[r++]); )
                if (i.toLowerCase() === n) return !0;
              return !1;
            }
            "number" == typeof i && (o = !1);
          }
        }
        return !1;
      }
      function rp(e) {
        return 4 === e.type && e.value !== np;
      }
      function LI(e, n, t) {
        return n === (4 !== e.type || t ? e.value : np);
      }
      function VI(e, n, t) {
        let r = 4;
        const o = e.attrs || [],
          i = (function HI(e) {
            for (let n = 0; n < e.length; n++) if (Kh(e[n])) return n;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < n.length; a++) {
          const u = n[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !LI(e, u, t)) || ("" === u && 1 === n.length))
                ) {
                  if (Rt(r)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & r ? u : n[++a];
                if (8 & r && null !== e.attrs) {
                  if (!kI(e.attrs, c, t)) {
                    if (Rt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = jI(8 & r ? "class" : u, o, rp(e), t);
                if (-1 === d) {
                  if (Rt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== c) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Jh(h, c, 0)) || (2 & r && c !== f)) {
                    if (Rt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Rt(r) && !Rt(u)) return !1;
            if (s && Rt(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return Rt(r) || s;
      }
      function Rt(e) {
        return 0 == (1 & e);
      }
      function jI(e, n, t, r) {
        if (null === n) return -1;
        let o = 0;
        if (r || !t) {
          let i = !1;
          for (; o < n.length; ) {
            const s = n[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = n[++o];
                for (; "string" == typeof a; ) a = n[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function $I(e, n) {
          let t = e.indexOf(4);
          if (t > -1)
            for (t++; t < e.length; ) {
              const r = e[t];
              if ("number" == typeof r) return -1;
              if (r === n) return t;
              t++;
            }
          return -1;
        })(n, e);
      }
      function op(e, n, t = !1) {
        for (let r = 0; r < n.length; r++) if (VI(e, n[r], t)) return !0;
        return !1;
      }
      function ip(e, n) {
        return e ? ":not(" + n.trim() + ")" : n;
      }
      function zI(e) {
        let n = e[0],
          t = 1,
          r = 2,
          o = "",
          i = !1;
        for (; t < e.length; ) {
          let s = e[t];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++t];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Rt(s) && ((n += ip(i, o)), (o = "")),
              (r = s),
              (i = i || !Rt(r));
          t++;
        }
        return "" !== o && (n += ip(i, o)), n;
      }
      function Ue(e) {
        return sn(() => {
          const n = ap(e),
            t = {
              ...n,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === Cs.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (n.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || Nt.Emulated,
              styles: e.styles || W,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          up(t);
          const r = e.dependencies;
          return (
            (t.directiveDefs = Es(r, !1)),
            (t.pipeDefs = Es(r, !0)),
            (t.id = (function JI(e) {
              let n = 0;
              const t = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.signals,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const o of t) n = (Math.imul(31, n) + o.charCodeAt(0)) << 0;
              return (n += 2147483648), "c" + n;
            })(t)),
            t
          );
        });
      }
      function ZI(e) {
        return G(e) || Ne(e);
      }
      function YI(e) {
        return null !== e;
      }
      function et(e) {
        return sn(() => ({
          type: e.type,
          bootstrap: e.bootstrap || W,
          declarations: e.declarations || W,
          imports: e.imports || W,
          exports: e.exports || W,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function sp(e, n) {
        if (null == e) return $t;
        const t = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (t[o] = r),
              n && (n[o] = i);
          }
        return t;
      }
      function F(e) {
        return sn(() => {
          const n = ap(e);
          return up(n), n;
        });
      }
      function ke(e) {
        return {
          type: e.type,
          name: e.name,
          factory: null,
          pure: !1 !== e.pure,
          standalone: !0 === e.standalone,
          onDestroy: e.type.prototype.ngOnDestroy || null,
        };
      }
      function G(e) {
        return e[ws] || null;
      }
      function Ne(e) {
        return e[lc] || null;
      }
      function ze(e) {
        return e[dc] || null;
      }
      function ct(e, n) {
        const t = e[Qh] || null;
        if (!t && !0 === n)
          throw new Error(`Type ${Ie(e)} does not have '\u0275mod' property.`);
        return t;
      }
      function ap(e) {
        const n = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: n,
          inputTransforms: null,
          inputConfig: e.inputs || $t,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || W,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: sp(e.inputs, n),
          outputs: sp(e.outputs),
        };
      }
      function up(e) {
        e.features?.forEach((n) => n(e));
      }
      function Es(e, n) {
        if (!e) return null;
        const t = n ? ze : ZI;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => t(r)).filter(YI);
      }
      const pe = 0,
        w = 1,
        j = 2,
        le = 3,
        xt = 4,
        Lo = 5,
        Le = 6,
        Dr = 7,
        ye = 8,
        Sn = 9,
        _r = 10,
        L = 11,
        Vo = 12,
        cp = 13,
        Cr = 14,
        ve = 15,
        jo = 16,
        wr = 17,
        Ut = 18,
        Bo = 19,
        lp = 20,
        An = 21,
        un = 22,
        Ho = 23,
        $o = 24,
        U = 25,
        hc = 1,
        dp = 2,
        zt = 7,
        Er = 9,
        Re = 11;
      function tt(e) {
        return Array.isArray(e) && "object" == typeof e[hc];
      }
      function Ge(e) {
        return Array.isArray(e) && !0 === e[hc];
      }
      function pc(e) {
        return 0 != (4 & e.flags);
      }
      function Zn(e) {
        return e.componentOffset > -1;
      }
      function Is(e) {
        return 1 == (1 & e.flags);
      }
      function Ot(e) {
        return !!e.template;
      }
      function gc(e) {
        return 0 != (512 & e[j]);
      }
      function Yn(e, n) {
        return e.hasOwnProperty(an) ? e[an] : null;
      }
      let xe = null,
        Ms = !1;
      function _t(e) {
        const n = xe;
        return (xe = e), n;
      }
      const pp = {
        version: 0,
        dirty: !1,
        producerNode: void 0,
        producerLastReadVersion: void 0,
        producerIndexOfThis: void 0,
        nextProducerIndex: 0,
        liveConsumerNode: void 0,
        liveConsumerIndexOfThis: void 0,
        consumerAllowSignalWrites: !1,
        consumerIsAlwaysLive: !1,
        producerMustRecompute: () => !1,
        producerRecomputeValue: () => {},
        consumerMarkedDirty: () => {},
      };
      function mp(e) {
        if (!zo(e) || e.dirty) {
          if (!e.producerMustRecompute(e) && !Dp(e)) return void (e.dirty = !1);
          e.producerRecomputeValue(e), (e.dirty = !1);
        }
      }
      function vp(e) {
        (e.dirty = !0),
          (function yp(e) {
            if (void 0 === e.liveConsumerNode) return;
            const n = Ms;
            Ms = !0;
            try {
              for (const t of e.liveConsumerNode) t.dirty || vp(t);
            } finally {
              Ms = n;
            }
          })(e),
          e.consumerMarkedDirty?.(e);
      }
      function yc(e) {
        return e && (e.nextProducerIndex = 0), _t(e);
      }
      function vc(e, n) {
        if (
          (_t(n),
          e &&
            void 0 !== e.producerNode &&
            void 0 !== e.producerIndexOfThis &&
            void 0 !== e.producerLastReadVersion)
        ) {
          if (zo(e))
            for (let t = e.nextProducerIndex; t < e.producerNode.length; t++)
              Ss(e.producerNode[t], e.producerIndexOfThis[t]);
          for (; e.producerNode.length > e.nextProducerIndex; )
            e.producerNode.pop(),
              e.producerLastReadVersion.pop(),
              e.producerIndexOfThis.pop();
        }
      }
      function Dp(e) {
        br(e);
        for (let n = 0; n < e.producerNode.length; n++) {
          const t = e.producerNode[n],
            r = e.producerLastReadVersion[n];
          if (r !== t.version || (mp(t), r !== t.version)) return !0;
        }
        return !1;
      }
      function _p(e) {
        if ((br(e), zo(e)))
          for (let n = 0; n < e.producerNode.length; n++)
            Ss(e.producerNode[n], e.producerIndexOfThis[n]);
        (e.producerNode.length =
          e.producerLastReadVersion.length =
          e.producerIndexOfThis.length =
            0),
          e.liveConsumerNode &&
            (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
      }
      function Ss(e, n) {
        if (
          ((function wp(e) {
            (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
          })(e),
          br(e),
          1 === e.liveConsumerNode.length)
        )
          for (let r = 0; r < e.producerNode.length; r++)
            Ss(e.producerNode[r], e.producerIndexOfThis[r]);
        const t = e.liveConsumerNode.length - 1;
        if (
          ((e.liveConsumerNode[n] = e.liveConsumerNode[t]),
          (e.liveConsumerIndexOfThis[n] = e.liveConsumerIndexOfThis[t]),
          e.liveConsumerNode.length--,
          e.liveConsumerIndexOfThis.length--,
          n < e.liveConsumerNode.length)
        ) {
          const r = e.liveConsumerIndexOfThis[n],
            o = e.liveConsumerNode[n];
          br(o), (o.producerIndexOfThis[r] = n);
        }
      }
      function zo(e) {
        return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
      }
      function br(e) {
        (e.producerNode ??= []),
          (e.producerIndexOfThis ??= []),
          (e.producerLastReadVersion ??= []);
      }
      let Ep = null;
      const Sp = () => {},
        dM = (() => ({
          ...pp,
          consumerIsAlwaysLive: !0,
          consumerAllowSignalWrites: !1,
          consumerMarkedDirty: (e) => {
            e.schedule(e.ref);
          },
          hasRun: !1,
          cleanupFn: Sp,
        }))();
      class fM {
        constructor(n, t, r) {
          (this.previousValue = n),
            (this.currentValue = t),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Ct() {
        return Ap;
      }
      function Ap(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = pM), hM;
      }
      function hM() {
        const e = Np(this),
          n = e?.current;
        if (n) {
          const t = e.previous;
          if (t === $t) e.previous = n;
          else for (let r in n) t[r] = n[r];
          (e.current = null), this.ngOnChanges(n);
        }
      }
      function pM(e, n, t, r) {
        const o = this.declaredInputs[t],
          i =
            Np(e) ||
            (function gM(e, n) {
              return (e[Tp] = n);
            })(e, { previous: $t, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          u = a[o];
        (s[o] = new fM(u && u.currentValue, n, a === $t)), (e[r] = n);
      }
      Ct.ngInherit = !0;
      const Tp = "__ngSimpleChanges__";
      function Np(e) {
        return e[Tp] || null;
      }
      const Gt = function (e, n, t) {};
      function se(e) {
        for (; Array.isArray(e); ) e = e[pe];
        return e;
      }
      function As(e, n) {
        return se(n[e]);
      }
      function nt(e, n) {
        return se(n[e.index]);
      }
      function Op(e, n) {
        return e.data[n];
      }
      function Ir(e, n) {
        return e[n];
      }
      function lt(e, n) {
        const t = n[e];
        return tt(t) ? t : t[pe];
      }
      function Nn(e, n) {
        return null == n ? null : e[n];
      }
      function Pp(e) {
        e[wr] = 0;
      }
      function CM(e) {
        1024 & e[j] || ((e[j] |= 1024), kp(e, 1));
      }
      function Fp(e) {
        1024 & e[j] && ((e[j] &= -1025), kp(e, -1));
      }
      function kp(e, n) {
        let t = e[le];
        if (null === t) return;
        t[Lo] += n;
        let r = t;
        for (
          t = t[le];
          null !== t && ((1 === n && 1 === r[Lo]) || (-1 === n && 0 === r[Lo]));

        )
          (t[Lo] += n), (r = t), (t = t[le]);
      }
      const O = {
        lFrame: Wp(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function jp() {
        return O.bindingsEnabled;
      }
      function v() {
        return O.lFrame.lView;
      }
      function q() {
        return O.lFrame.tView;
      }
      function Oe() {
        let e = Bp();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Bp() {
        return O.lFrame.currentTNode;
      }
      function qt(e, n) {
        const t = O.lFrame;
        (t.currentTNode = e), (t.isParent = n);
      }
      function Ec() {
        return O.lFrame.isParent;
      }
      function qe() {
        const e = O.lFrame;
        let n = e.bindingRootIndex;
        return (
          -1 === n && (n = e.bindingRootIndex = e.tView.bindingStartIndex), n
        );
      }
      function Sr() {
        return O.lFrame.bindingIndex++;
      }
      function FM(e, n) {
        const t = O.lFrame;
        (t.bindingIndex = t.bindingRootIndex = e), Ic(n);
      }
      function Ic(e) {
        O.lFrame.currentDirectiveIndex = e;
      }
      function zp() {
        return O.lFrame.currentQueryIndex;
      }
      function Sc(e) {
        O.lFrame.currentQueryIndex = e;
      }
      function LM(e) {
        const n = e[w];
        return 2 === n.type ? n.declTNode : 1 === n.type ? e[Le] : null;
      }
      function Gp(e, n, t) {
        if (t & $.SkipSelf) {
          let o = n,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              t & $.Host ||
              ((o = LM(i)), null === o || ((i = i[Cr]), 10 & o.type)));

          );
          if (null === o) return !1;
          (n = o), (e = i);
        }
        const r = (O.lFrame = qp());
        return (r.currentTNode = n), (r.lView = e), !0;
      }
      function Ac(e) {
        const n = qp(),
          t = e[w];
        (O.lFrame = n),
          (n.currentTNode = t.firstChild),
          (n.lView = e),
          (n.tView = t),
          (n.contextLView = e),
          (n.bindingIndex = t.bindingStartIndex),
          (n.inI18n = !1);
      }
      function qp() {
        const e = O.lFrame,
          n = null === e ? null : e.child;
        return null === n ? Wp(e) : n;
      }
      function Wp(e) {
        const n = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = n), n;
      }
      function Zp() {
        const e = O.lFrame;
        return (
          (O.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Yp = Zp;
      function Tc() {
        const e = Zp();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function We() {
        return O.lFrame.selectedIndex;
      }
      function Qn(e) {
        O.lFrame.selectedIndex = e;
      }
      function he() {
        const e = O.lFrame;
        return Op(e.tView, e.selectedIndex);
      }
      let Xp = !0;
      function Ts() {
        return Xp;
      }
      function Rn(e) {
        Xp = e;
      }
      function Ns(e, n) {
        for (let t = n.directiveStart, r = n.directiveEnd; t < r; t++) {
          const i = e.data[t].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: c,
              ngOnDestroy: l,
            } = i;
          s && (e.contentHooks ??= []).push(-t, s),
            a &&
              ((e.contentHooks ??= []).push(t, a),
              (e.contentCheckHooks ??= []).push(t, a)),
            u && (e.viewHooks ??= []).push(-t, u),
            c &&
              ((e.viewHooks ??= []).push(t, c),
              (e.viewCheckHooks ??= []).push(t, c)),
            null != l && (e.destroyHooks ??= []).push(t, l);
        }
      }
      function Rs(e, n, t) {
        Jp(e, n, 3, t);
      }
      function xs(e, n, t, r) {
        (3 & e[j]) === t && Jp(e, n, t, r);
      }
      function Nc(e, n) {
        let t = e[j];
        (3 & t) === n && ((t &= 8191), (t += 1), (e[j] = t));
      }
      function Jp(e, n, t, r) {
        const i = r ?? -1,
          s = n.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[wr] : 0; u < s; u++)
          if ("number" == typeof n[u + 1]) {
            if (((a = n[u]), null != r && a >= r)) break;
          } else
            n[u] < 0 && (e[wr] += 65536),
              (a < i || -1 == i) &&
                (GM(e, t, n, u), (e[wr] = (4294901760 & e[wr]) + u + 2)),
              u++;
      }
      function Kp(e, n) {
        Gt(4, e, n);
        const t = _t(null);
        try {
          n.call(e);
        } finally {
          _t(t), Gt(5, e, n);
        }
      }
      function GM(e, n, t, r) {
        const o = t[r] < 0,
          i = t[r + 1],
          a = e[o ? -t[r] : t[r]];
        o
          ? e[j] >> 13 < e[wr] >> 16 &&
            (3 & e[j]) === n &&
            ((e[j] += 8192), Kp(a, i))
          : Kp(a, i);
      }
      const Ar = -1;
      class qo {
        constructor(n, t, r) {
          (this.factory = n),
            (this.resolving = !1),
            (this.canSeeViewProviders = t),
            (this.injectImpl = r);
        }
      }
      function xc(e) {
        return e !== Ar;
      }
      function Wo(e) {
        return 32767 & e;
      }
      function Zo(e, n) {
        let t = (function YM(e) {
            return e >> 16;
          })(e),
          r = n;
        for (; t > 0; ) (r = r[Cr]), t--;
        return r;
      }
      let Oc = !0;
      function Os(e) {
        const n = Oc;
        return (Oc = e), n;
      }
      const eg = 255,
        tg = 5;
      let QM = 0;
      const Wt = {};
      function Ps(e, n) {
        const t = ng(e, n);
        if (-1 !== t) return t;
        const r = n[w];
        r.firstCreatePass &&
          ((e.injectorIndex = n.length),
          Pc(r.data, e),
          Pc(n, null),
          Pc(r.blueprint, null));
        const o = Fs(e, n),
          i = e.injectorIndex;
        if (xc(o)) {
          const s = Wo(o),
            a = Zo(o, n),
            u = a[w].data;
          for (let c = 0; c < 8; c++) n[i + c] = a[s + c] | u[s + c];
        }
        return (n[i + 8] = o), i;
      }
      function Pc(e, n) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, n);
      }
      function ng(e, n) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === n[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Fs(e, n) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let t = 0,
          r = null,
          o = n;
        for (; null !== o; ) {
          if (((r = cg(o)), null === r)) return Ar;
          if ((t++, (o = o[Cr]), -1 !== r.injectorIndex))
            return r.injectorIndex | (t << 16);
        }
        return Ar;
      }
      function Fc(e, n, t) {
        !(function XM(e, n, t) {
          let r;
          "string" == typeof t
            ? (r = t.charCodeAt(0) || 0)
            : t.hasOwnProperty(Fo) && (r = t[Fo]),
            null == r && (r = t[Fo] = QM++);
          const o = r & eg;
          n.data[e + (o >> tg)] |= 1 << o;
        })(e, n, t);
      }
      function rg(e, n, t) {
        if (t & $.Optional || void 0 !== e) return e;
        tc();
      }
      function og(e, n, t, r) {
        if (
          (t & $.Optional && void 0 === r && (r = null),
          !(t & ($.Self | $.Host)))
        ) {
          const o = e[Sn],
            i = Ke(void 0);
          try {
            return o ? o.get(n, r, t & $.Optional) : qh(n, r, t & $.Optional);
          } finally {
            Ke(i);
          }
        }
        return rg(r, 0, t);
      }
      function ig(e, n, t, r = $.Default, o) {
        if (null !== e) {
          if (2048 & n[j] && !(r & $.Self)) {
            const s = (function rS(e, n, t, r, o) {
              let i = e,
                s = n;
              for (
                ;
                null !== i && null !== s && 2048 & s[j] && !(512 & s[j]);

              ) {
                const a = sg(i, s, t, r | $.Self, Wt);
                if (a !== Wt) return a;
                let u = i.parent;
                if (!u) {
                  const c = s[lp];
                  if (c) {
                    const l = c.get(t, Wt, r);
                    if (l !== Wt) return l;
                  }
                  (u = cg(s)), (s = s[Cr]);
                }
                i = u;
              }
              return o;
            })(e, n, t, r, Wt);
            if (s !== Wt) return s;
          }
          const i = sg(e, n, t, r, Wt);
          if (i !== Wt) return i;
        }
        return og(n, t, r, o);
      }
      function sg(e, n, t, r, o) {
        const i = (function eS(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const n = e.hasOwnProperty(Fo) ? e[Fo] : void 0;
          return "number" == typeof n ? (n >= 0 ? n & eg : nS) : n;
        })(t);
        if ("function" == typeof i) {
          if (!Gp(n, e, r)) return r & $.Host ? rg(o, 0, r) : og(n, t, r, o);
          try {
            let s;
            if (((s = i(r)), null != s || r & $.Optional)) return s;
            tc();
          } finally {
            Yp();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = ng(e, n),
            u = Ar,
            c = r & $.Host ? n[ve][Le] : null;
          for (
            (-1 === a || r & $.SkipSelf) &&
            ((u = -1 === a ? Fs(e, n) : n[a + 8]),
            u !== Ar && ug(r, !1)
              ? ((s = n[w]), (a = Wo(u)), (n = Zo(u, n)))
              : (a = -1));
            -1 !== a;

          ) {
            const l = n[w];
            if (ag(i, a, l.data)) {
              const d = KM(a, n, t, s, r, c);
              if (d !== Wt) return d;
            }
            (u = n[a + 8]),
              u !== Ar && ug(r, n[w].data[a + 8] === c) && ag(i, a, n)
                ? ((s = l), (a = Wo(u)), (n = Zo(u, n)))
                : (a = -1);
          }
        }
        return o;
      }
      function KM(e, n, t, r, o, i) {
        const s = n[w],
          a = s.data[e + 8],
          l = ks(
            a,
            s,
            t,
            null == r ? Zn(a) && Oc : r != s && 0 != (3 & a.type),
            o & $.Host && i === a
          );
        return null !== l ? Xn(n, s, l, a) : Wt;
      }
      function ks(e, n, t, r, o) {
        const i = e.providerIndexes,
          s = n.data,
          a = 1048575 & i,
          u = e.directiveStart,
          l = i >> 20,
          f = o ? a + l : e.directiveEnd;
        for (let h = r ? a : a + l; h < f; h++) {
          const p = s[h];
          if ((h < u && t === p) || (h >= u && p.type === t)) return h;
        }
        if (o) {
          const h = s[u];
          if (h && Ot(h) && h.type === t) return u;
        }
        return null;
      }
      function Xn(e, n, t, r) {
        let o = e[t];
        const i = n.data;
        if (
          (function qM(e) {
            return e instanceof qo;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function DI(e, n) {
              const t = n ? `. Dependency path: ${n.join(" > ")} > ${e}` : "";
              throw new D(
                -200,
                `Circular dependency in DI detected for ${e}${t}`
              );
            })(
              (function X(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : k(e);
              })(i[t])
            );
          const a = Os(s.canSeeViewProviders);
          s.resolving = !0;
          const c = s.injectImpl ? Ke(s.injectImpl) : null;
          Gp(e, r, $.Default);
          try {
            (o = e[t] = s.factory(void 0, i, e, r)),
              n.firstCreatePass &&
                t >= r.directiveStart &&
                (function zM(e, n, t) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = n.type.prototype;
                  if (r) {
                    const s = Ap(n);
                    (t.preOrderHooks ??= []).push(e, s),
                      (t.preOrderCheckHooks ??= []).push(e, s);
                  }
                  o && (t.preOrderHooks ??= []).push(0 - e, o),
                    i &&
                      ((t.preOrderHooks ??= []).push(e, i),
                      (t.preOrderCheckHooks ??= []).push(e, i));
                })(t, i[t], n);
          } finally {
            null !== c && Ke(c), Os(a), (s.resolving = !1), Yp();
          }
        }
        return o;
      }
      function ag(e, n, t) {
        return !!(t[n + (e >> tg)] & (1 << e));
      }
      function ug(e, n) {
        return !(e & $.Self || (e & $.Host && n));
      }
      class Ze {
        constructor(n, t) {
          (this._tNode = n), (this._lView = t);
        }
        get(n, t, r) {
          return ig(this._tNode, this._lView, n, _s(r), t);
        }
      }
      function nS() {
        return new Ze(Oe(), v());
      }
      function Pe(e) {
        return sn(() => {
          const n = e.prototype.constructor,
            t = n[an] || kc(n),
            r = Object.prototype;
          let o = Object.getPrototypeOf(e.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[an] || kc(o);
            if (i && i !== t) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function kc(e) {
        return Ku(e)
          ? () => {
              const n = kc(P(e));
              return n && n();
            }
          : Yn(e);
      }
      function cg(e) {
        const n = e[w],
          t = n.type;
        return 2 === t ? n.declTNode : 1 === t ? e[Le] : null;
      }
      const Nr = "__parameters__";
      function xr(e, n, t) {
        return sn(() => {
          const r = (function Lc(e) {
            return function (...t) {
              if (e) {
                const r = e(...t);
                for (const o in r) this[o] = r[o];
              }
            };
          })(n);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, c, l) {
              const d = u.hasOwnProperty(Nr)
                ? u[Nr]
                : Object.defineProperty(u, Nr, { value: [] })[Nr];
              for (; d.length <= l; ) d.push(null);
              return (d[l] = d[l] || []).push(s), u;
            }
          }
          return (
            t && (o.prototype = Object.create(t.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      function Pr(e, n) {
        e.forEach((t) => (Array.isArray(t) ? Pr(t, n) : n(t)));
      }
      function dg(e, n, t) {
        n >= e.length ? e.push(t) : e.splice(n, 0, t);
      }
      function Vs(e, n) {
        return n >= e.length - 1 ? e.pop() : e.splice(n, 1)[0];
      }
      function dt(e, n, t) {
        let r = Fr(e, n);
        return (
          r >= 0
            ? (e[1 | r] = t)
            : ((r = ~r),
              (function lS(e, n, t, r) {
                let o = e.length;
                if (o == n) e.push(t, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = t);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > n; )
                    (e[o] = e[o - 2]), o--;
                  (e[n] = t), (e[n + 1] = r);
                }
              })(e, r, n, t)),
          r
        );
      }
      function Vc(e, n) {
        const t = Fr(e, n);
        if (t >= 0) return e[1 | t];
      }
      function Fr(e, n) {
        return (function fg(e, n, t) {
          let r = 0,
            o = e.length >> t;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << t];
            if (n === s) return i << t;
            s > n ? (o = i) : (r = i + 1);
          }
          return ~(o << t);
        })(e, n, 1);
      }
      const Bs = Po(xr("Optional"), 8),
        Hs = Po(xr("SkipSelf"), 4);
      function qs(e) {
        return 128 == (128 & e.flags);
      }
      var xn = (function (e) {
        return (
          (e[(e.Important = 1)] = "Important"),
          (e[(e.DashCase = 2)] = "DashCase"),
          e
        );
      })(xn || {});
      const Uc = new Map();
      let PS = 0;
      const Gc = "__ngContext__";
      function Ve(e, n) {
        tt(n)
          ? ((e[Gc] = n[Bo]),
            (function kS(e) {
              Uc.set(e[Bo], e);
            })(n))
          : (e[Gc] = n);
      }
      let qc;
      function Wc(e, n) {
        return qc(e, n);
      }
      function ei(e) {
        const n = e[le];
        return Ge(n) ? n[le] : n;
      }
      function xg(e) {
        return Pg(e[Vo]);
      }
      function Og(e) {
        return Pg(e[xt]);
      }
      function Pg(e) {
        for (; null !== e && !Ge(e); ) e = e[xt];
        return e;
      }
      function Vr(e, n, t, r, o) {
        if (null != r) {
          let i,
            s = !1;
          Ge(r) ? (i = r) : tt(r) && ((s = !0), (r = r[pe]));
          const a = se(r);
          0 === e && null !== t
            ? null == o
              ? Vg(n, t, a)
              : Jn(n, t, a, o || null, !0)
            : 1 === e && null !== t
            ? Jn(n, t, a, o || null, !0)
            : 2 === e
            ? (function Ks(e, n, t) {
                const r = Xs(e, n);
                r &&
                  (function t0(e, n, t, r) {
                    e.removeChild(n, t, r);
                  })(e, r, n, t);
              })(n, a, s)
            : 3 === e && n.destroyNode(a),
            null != i &&
              (function o0(e, n, t, r, o) {
                const i = t[zt];
                i !== se(t) && Vr(n, e, r, i, o);
                for (let a = Re; a < t.length; a++) {
                  const u = t[a];
                  ni(u[w], u, e, n, r, i);
                }
              })(n, e, i, t, o);
        }
      }
      function Ys(e, n, t) {
        return e.createElement(n, t);
      }
      function kg(e, n) {
        const t = e[Er],
          r = t.indexOf(n);
        Fp(n), t.splice(r, 1);
      }
      function Qs(e, n) {
        if (e.length <= Re) return;
        const t = Re + n,
          r = e[t];
        if (r) {
          const o = r[jo];
          null !== o && o !== e && kg(o, r), n > 0 && (e[t - 1][xt] = r[xt]);
          const i = Vs(e, Re + n);
          !(function WS(e, n) {
            ni(e, n, n[L], 2, null, null), (n[pe] = null), (n[Le] = null);
          })(r[w], r);
          const s = i[Ut];
          null !== s && s.detachView(i[w]),
            (r[le] = null),
            (r[xt] = null),
            (r[j] &= -129);
        }
        return r;
      }
      function Yc(e, n) {
        if (!(256 & n[j])) {
          const t = n[L];
          n[Ho] && _p(n[Ho]),
            n[$o] && _p(n[$o]),
            t.destroyNode && ni(e, n, t, 3, null, null),
            (function QS(e) {
              let n = e[Vo];
              if (!n) return Qc(e[w], e);
              for (; n; ) {
                let t = null;
                if (tt(n)) t = n[Vo];
                else {
                  const r = n[Re];
                  r && (t = r);
                }
                if (!t) {
                  for (; n && !n[xt] && n !== e; )
                    tt(n) && Qc(n[w], n), (n = n[le]);
                  null === n && (n = e), tt(n) && Qc(n[w], n), (t = n && n[xt]);
                }
                n = t;
              }
            })(n);
        }
      }
      function Qc(e, n) {
        if (!(256 & n[j])) {
          (n[j] &= -129),
            (n[j] |= 256),
            (function e0(e, n) {
              let t;
              if (null != e && null != (t = e.destroyHooks))
                for (let r = 0; r < t.length; r += 2) {
                  const o = n[t[r]];
                  if (!(o instanceof qo)) {
                    const i = t[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        Gt(4, a, u);
                        try {
                          u.call(a);
                        } finally {
                          Gt(5, a, u);
                        }
                      }
                    else {
                      Gt(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        Gt(5, o, i);
                      }
                    }
                  }
                }
            })(e, n),
            (function KS(e, n) {
              const t = e.cleanup,
                r = n[Dr];
              if (null !== t)
                for (let i = 0; i < t.length - 1; i += 2)
                  if ("string" == typeof t[i]) {
                    const s = t[i + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
                  } else t[i].call(r[t[i + 1]]);
              null !== r && (n[Dr] = null);
              const o = n[An];
              if (null !== o) {
                n[An] = null;
                for (let i = 0; i < o.length; i++) (0, o[i])();
              }
            })(e, n),
            1 === n[w].type && n[L].destroy();
          const t = n[jo];
          if (null !== t && Ge(n[le])) {
            t !== n[le] && kg(t, n);
            const r = n[Ut];
            null !== r && r.detachView(e);
          }
          !(function LS(e) {
            Uc.delete(e[Bo]);
          })(n);
        }
      }
      function Xc(e, n, t) {
        return (function Lg(e, n, t) {
          let r = n;
          for (; null !== r && 40 & r.type; ) r = (n = r).parent;
          if (null === r) return t[pe];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = e.data[r.directiveStart + o];
              if (i === Nt.None || i === Nt.Emulated) return null;
            }
            return nt(r, t);
          }
        })(e, n.parent, t);
      }
      function Jn(e, n, t, r, o) {
        e.insertBefore(n, t, r, o);
      }
      function Vg(e, n, t) {
        e.appendChild(n, t);
      }
      function jg(e, n, t, r, o) {
        null !== r ? Jn(e, n, t, r, o) : Vg(e, n, t);
      }
      function Xs(e, n) {
        return e.parentNode(n);
      }
      let Jc,
        nl,
        ta,
        $g = function Hg(e, n, t) {
          return 40 & e.type ? nt(e, t) : null;
        };
      function Js(e, n, t, r) {
        const o = Xc(e, r, n),
          i = n[L],
          a = (function Bg(e, n, t) {
            return $g(e, n, t);
          })(r.parent || n[Le], r, n);
        if (null != o)
          if (Array.isArray(t))
            for (let u = 0; u < t.length; u++) jg(i, o, t[u], a, !1);
          else jg(i, o, t, a, !1);
        void 0 !== Jc && Jc(i, r, n, t, o);
      }
      function ti(e, n) {
        if (null !== n) {
          const t = n.type;
          if (3 & t) return nt(n, e);
          if (4 & t) return Kc(-1, e[n.index]);
          if (8 & t) {
            const r = n.child;
            if (null !== r) return ti(e, r);
            {
              const o = e[n.index];
              return Ge(o) ? Kc(-1, o) : se(o);
            }
          }
          if (32 & t) return Wc(n, e)() || se(e[n.index]);
          {
            const r = zg(e, n);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : ti(ei(e[ve]), r)
              : ti(e, n.next);
          }
        }
        return null;
      }
      function zg(e, n) {
        return null !== n ? e[ve][Le].projection[n.projection] : null;
      }
      function Kc(e, n) {
        const t = Re + e + 1;
        if (t < n.length) {
          const r = n[t],
            o = r[w].firstChild;
          if (null !== o) return ti(r, o);
        }
        return n[zt];
      }
      function el(e, n, t, r, o, i, s) {
        for (; null != t; ) {
          const a = r[t.index],
            u = t.type;
          if (
            (s && 0 === n && (a && Ve(se(a), r), (t.flags |= 2)),
            32 != (32 & t.flags))
          )
            if (8 & u) el(e, n, t.child, r, o, i, !1), Vr(n, e, o, a, i);
            else if (32 & u) {
              const c = Wc(t, r);
              let l;
              for (; (l = c()); ) Vr(n, e, o, l, i);
              Vr(n, e, o, a, i);
            } else 16 & u ? qg(e, n, r, t, o, i) : Vr(n, e, o, a, i);
          t = s ? t.projectionNext : t.next;
        }
      }
      function ni(e, n, t, r, o, i) {
        el(t, r, e.firstChild, n, o, i, !1);
      }
      function qg(e, n, t, r, o, i) {
        const s = t[ve],
          u = s[Le].projection[r.projection];
        if (Array.isArray(u))
          for (let c = 0; c < u.length; c++) Vr(n, e, o, u[c], i);
        else {
          let c = u;
          const l = s[le];
          qs(r) && (c.flags |= 128), el(e, n, c, l, o, i, !0);
        }
      }
      function Wg(e, n, t) {
        "" === t
          ? e.removeAttribute(n, "class")
          : e.setAttribute(n, "class", t);
      }
      function Zg(e, n, t) {
        const { mergedAttrs: r, classes: o, styles: i } = t;
        null !== r && fc(e, n, r),
          null !== o && Wg(e, n, o),
          null !== i &&
            (function a0(e, n, t) {
              e.setAttribute(n, "style", t);
            })(e, n, i);
      }
      function Xg(e) {
        return (
          (function rl() {
            if (void 0 === ta && ((ta = null), ie.trustedTypes))
              try {
                ta = ie.trustedTypes.createPolicy("angular#unsafe-bypass", {
                  createHTML: (e) => e,
                  createScript: (e) => e,
                  createScriptURL: (e) => e,
                });
              } catch {}
            return ta;
          })()?.createScriptURL(e) || e
        );
      }
      class Jg {
        constructor(n) {
          this.changingThisBreaksApplicationSecurity = n;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${$h})`;
        }
      }
      function On(e) {
        return e instanceof Jg ? e.changingThisBreaksApplicationSecurity : e;
      }
      function ri(e, n) {
        const t = (function y0(e) {
          return (e instanceof Jg && e.getTypeName()) || null;
        })(e);
        if (null != t && t !== n) {
          if ("ResourceURL" === t && "URL" === n) return !0;
          throw new Error(`Required a safe ${n}, got a ${t} (see ${$h})`);
        }
        return t === n;
      }
      const C0 = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      var Hr = (function (e) {
        return (
          (e[(e.NONE = 0)] = "NONE"),
          (e[(e.HTML = 1)] = "HTML"),
          (e[(e.STYLE = 2)] = "STYLE"),
          (e[(e.SCRIPT = 3)] = "SCRIPT"),
          (e[(e.URL = 4)] = "URL"),
          (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
          e
        );
      })(Hr || {});
      function im(e) {
        const n = ii();
        return n
          ? n.sanitize(Hr.URL, e) || ""
          : ri(e, "URL")
          ? On(e)
          : (function ol(e) {
              return (e = String(e)).match(C0) ? e : "unsafe:" + e;
            })(k(e));
      }
      function sm(e) {
        const n = ii();
        if (n) return Xg(n.sanitize(Hr.RESOURCE_URL, e) || "");
        if (ri(e, "ResourceURL")) return Xg(On(e));
        throw new D(904, !1);
      }
      function ii() {
        const e = v();
        return e && e[_r].sanitizer;
      }
      const si = new I("ENVIRONMENT_INITIALIZER"),
        um = new I("INJECTOR", -1),
        cm = new I("INJECTOR_DEF_TYPES");
      class ul {
        get(n, t = Oo) {
          if (t === Oo) {
            const r = new Error(`NullInjectorError: No provider for ${Ie(n)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return t;
        }
      }
      function P0(...e) {
        return { ɵproviders: lm(0, e), ɵfromNgModule: !0 };
      }
      function lm(e, ...n) {
        const t = [],
          r = new Set();
        let o;
        const i = (s) => {
          t.push(s);
        };
        return (
          Pr(n, (s) => {
            const a = s;
            ra(a, i, [], r) && ((o ||= []), o.push(a));
          }),
          void 0 !== o && dm(o, i),
          t
        );
      }
      function dm(e, n) {
        for (let t = 0; t < e.length; t++) {
          const { ngModule: r, providers: o } = e[t];
          ll(o, (i) => {
            n(i, r);
          });
        }
      }
      function ra(e, n, t, r) {
        if (!(e = P(e))) return !1;
        let o = null,
          i = ys(e);
        const s = !i && G(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = ys(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const c of u) ra(c, n, t, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let c;
              r.add(o);
              try {
                Pr(i.imports, (l) => {
                  ra(l, n, t, r) && ((c ||= []), c.push(l));
                });
              } finally {
              }
              void 0 !== c && dm(c, n);
            }
            if (!a) {
              const c = Yn(o) || (() => new o());
              n({ provide: o, useFactory: c, deps: W }, o),
                n({ provide: cm, useValue: o, multi: !0 }, o),
                n({ provide: si, useValue: () => M(o), multi: !0 }, o);
            }
            const u = i.providers;
            if (null != u && !a) {
              const c = e;
              ll(u, (l) => {
                n(l, c);
              });
            }
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      function ll(e, n) {
        for (let t of e)
          ec(t) && (t = t.ɵproviders), Array.isArray(t) ? ll(t, n) : n(t);
      }
      const F0 = J({ provide: String, useValue: J });
      function dl(e) {
        return null !== e && "object" == typeof e && F0 in e;
      }
      function Kn(e) {
        return "function" == typeof e;
      }
      const fl = new I("Set Injector scope."),
        oa = {},
        L0 = {};
      let hl;
      function ia() {
        return void 0 === hl && (hl = new ul()), hl;
      }
      class ft {}
      class $r extends ft {
        get destroyed() {
          return this._destroyed;
        }
        constructor(n, t, r, o) {
          super(),
            (this.parent = t),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            gl(n, (s) => this.processProvider(s)),
            this.records.set(um, Ur(void 0, this)),
            o.has("environment") && this.records.set(ft, Ur(void 0, this));
          const i = this.records.get(fl);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(cm.multi, W, $.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            const n = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const t of n) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(n) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(n),
            () => this.removeOnDestroy(n)
          );
        }
        runInContext(n) {
          this.assertNotDestroyed();
          const t = Mn(this),
            r = Ke(void 0);
          try {
            return n();
          } finally {
            Mn(t), Ke(r);
          }
        }
        get(n, t = Oo, r = $.Default) {
          if ((this.assertNotDestroyed(), n.hasOwnProperty(Xh)))
            return n[Xh](this);
          r = _s(r);
          const i = Mn(this),
            s = Ke(void 0);
          try {
            if (!(r & $.SkipSelf)) {
              let u = this.records.get(n);
              if (void 0 === u) {
                const c =
                  (function $0(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof I)
                    );
                  })(n) && ms(n);
                (u = c && this.injectableDefInScope(c) ? Ur(pl(n), oa) : null),
                  this.records.set(n, u);
              }
              if (null != u) return this.hydrate(n, u);
            }
            return (r & $.Self ? ia() : this.parent).get(
              n,
              (t = r & $.Optional && t === Oo ? null : t)
            );
          } catch (a) {
            if ("NullInjectorError" === a.name) {
              if (((a[Ds] = a[Ds] || []).unshift(Ie(n)), i)) throw a;
              return (function PI(e, n, t, r) {
                const o = e[Ds];
                throw (
                  (n[Zh] && o.unshift(n[Zh]),
                  (e.message = (function FI(e, n, t, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = Ie(n);
                    if (Array.isArray(n)) o = n.map(Ie).join(" -> ");
                    else if ("object" == typeof n) {
                      let i = [];
                      for (let s in n)
                        if (n.hasOwnProperty(s)) {
                          let a = n[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : Ie(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${t}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      TI,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, t, r)),
                  (e.ngTokenPath = o),
                  (e[Ds] = null),
                  e)
                );
              })(a, n, "R3InjectorError", this.source);
            }
            throw a;
          } finally {
            Ke(s), Mn(i);
          }
        }
        resolveInjectorInitializers() {
          const n = Mn(this),
            t = Ke(void 0);
          try {
            const o = this.get(si.multi, W, $.Self);
            for (const i of o) i();
          } finally {
            Mn(n), Ke(t);
          }
        }
        toString() {
          const n = [],
            t = this.records;
          for (const r of t.keys()) n.push(Ie(r));
          return `R3Injector[${n.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new D(205, !1);
        }
        processProvider(n) {
          let t = Kn((n = P(n))) ? n : P(n && n.provide);
          const r = (function j0(e) {
            return dl(e) ? Ur(void 0, e.useValue) : Ur(pm(e), oa);
          })(n);
          if (Kn(n) || !0 !== n.multi) this.records.get(t);
          else {
            let o = this.records.get(t);
            o ||
              ((o = Ur(void 0, oa, !0)),
              (o.factory = () => cc(o.multi)),
              this.records.set(t, o)),
              (t = n),
              o.multi.push(n);
          }
          this.records.set(t, r);
        }
        hydrate(n, t) {
          return (
            t.value === oa && ((t.value = L0), (t.value = t.factory())),
            "object" == typeof t.value &&
              t.value &&
              (function H0(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(t.value) &&
              this._ngOnDestroyHooks.add(t.value),
            t.value
          );
        }
        injectableDefInScope(n) {
          if (!n.providedIn) return !1;
          const t = P(n.providedIn);
          return "string" == typeof t
            ? "any" === t || this.scopes.has(t)
            : this.injectorDefTypes.has(t);
        }
        removeOnDestroy(n) {
          const t = this._onDestroyHooks.indexOf(n);
          -1 !== t && this._onDestroyHooks.splice(t, 1);
        }
      }
      function pl(e) {
        const n = ms(e),
          t = null !== n ? n.factory : Yn(e);
        if (null !== t) return t;
        if (e instanceof I) throw new D(204, !1);
        if (e instanceof Function)
          return (function V0(e) {
            const n = e.length;
            if (n > 0)
              throw (
                ((function Xo(e, n) {
                  const t = [];
                  for (let r = 0; r < e; r++) t.push(n);
                  return t;
                })(n, "?"),
                new D(204, !1))
              );
            const t = (function II(e) {
              return (e && (e[vs] || e[zh])) || null;
            })(e);
            return null !== t ? () => t.factory(e) : () => new e();
          })(e);
        throw new D(204, !1);
      }
      function pm(e, n, t) {
        let r;
        if (Kn(e)) {
          const o = P(e);
          return Yn(o) || pl(o);
        }
        if (dl(e)) r = () => P(e.useValue);
        else if (
          (function hm(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...cc(e.deps || []));
        else if (
          (function fm(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => M(P(e.useExisting));
        else {
          const o = P(e && (e.useClass || e.provide));
          if (
            !(function B0(e) {
              return !!e.deps;
            })(e)
          )
            return Yn(o) || pl(o);
          r = () => new o(...cc(e.deps));
        }
        return r;
      }
      function Ur(e, n, t = !1) {
        return { factory: e, value: n, multi: t ? [] : void 0 };
      }
      function gl(e, n) {
        for (const t of e)
          Array.isArray(t) ? gl(t, n) : t && ec(t) ? gl(t.ɵproviders, n) : n(t);
      }
      const sa = new I("AppId", { providedIn: "root", factory: () => U0 }),
        U0 = "ng",
        gm = new I("Platform Initializer"),
        er = new I("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        mm = new I("CSP nonce", {
          providedIn: "root",
          factory: () =>
            (function Br() {
              if (void 0 !== nl) return nl;
              if (typeof document < "u") return document;
              throw new D(210, !1);
            })()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let ym = (e, n, t) => null;
      function El(e, n, t = !1) {
        return ym(e, n, t);
      }
      class K0 {}
      class _m {}
      class tA {
        resolveComponentFactory(n) {
          throw (function eA(e) {
            const n = Error(`No component factory found for ${Ie(e)}.`);
            return (n.ngComponent = e), n;
          })(n);
        }
      }
      let fa = (() => {
        class e {
          static #e = (this.NULL = new tA());
        }
        return e;
      })();
      function nA() {
        return qr(Oe(), v());
      }
      function qr(e, n) {
        return new ht(nt(e, n));
      }
      let ht = (() => {
        class e {
          constructor(t) {
            this.nativeElement = t;
          }
          static #e = (this.__NG_ELEMENT_ID__ = nA);
        }
        return e;
      })();
      function rA(e) {
        return e instanceof ht ? e.nativeElement : e;
      }
      class wm {}
      let fn = (() => {
          class e {
            constructor() {
              this.destroyNode = null;
            }
            static #e = (this.__NG_ELEMENT_ID__ = () =>
              (function oA() {
                const e = v(),
                  t = lt(Oe().index, e);
                return (tt(t) ? t : e)[L];
              })());
          }
          return e;
        })(),
        iA = (() => {
          class e {
            static #e = (this.ɵprov = S({
              token: e,
              providedIn: "root",
              factory: () => null,
            }));
          }
          return e;
        })();
      class ci {
        constructor(n) {
          (this.full = n),
            (this.major = n.split(".")[0]),
            (this.minor = n.split(".")[1]),
            (this.patch = n.split(".").slice(2).join("."));
        }
      }
      const sA = new ci("16.2.12"),
        Ml = {};
      function Mm(e, n = null, t = null, r) {
        const o = Sm(e, n, t, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Sm(e, n = null, t = null, r, o = new Set()) {
        const i = [t || W, P0(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : Ie(e))),
          new $r(i, n || ia(), r || null, o)
        );
      }
      let pt = (() => {
        class e {
          static #e = (this.THROW_IF_NOT_FOUND = Oo);
          static #t = (this.NULL = new ul());
          static create(t, r) {
            if (Array.isArray(t)) return Mm({ name: "" }, r, t, "");
            {
              const o = t.name ?? "";
              return Mm({ name: o }, t.parent, t.providers, o);
            }
          }
          static #n = (this.ɵprov = S({
            token: e,
            providedIn: "any",
            factory: () => M(um),
          }));
          static #r = (this.__NG_ELEMENT_ID__ = -1);
        }
        return e;
      })();
      function Al(e) {
        return e.ngOriginalError;
      }
      class hn {
        constructor() {
          this._console = console;
        }
        handleError(n) {
          const t = this._findOriginalError(n);
          this._console.error("ERROR", n),
            t && this._console.error("ORIGINAL ERROR", t);
        }
        _findOriginalError(n) {
          let t = n && Al(n);
          for (; t && Al(t); ) t = Al(t);
          return t || null;
        }
      }
      function Nl(e) {
        return (n) => {
          setTimeout(e, void 0, n);
        };
      }
      const de = class hA extends At {
        constructor(n = !1) {
          super(), (this.__isAsync = n);
        }
        emit(n) {
          super.next(n);
        }
        subscribe(n, t, r) {
          let o = n,
            i = t || (() => null),
            s = r;
          if (n && "object" == typeof n) {
            const u = n;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = Nl(i)), o && (o = Nl(o)), s && (s = Nl(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return n instanceof st && n.add(a), a;
        }
      };
      function Tm(...e) {}
      class ae {
        constructor({
          enableLongStackTrace: n = !1,
          shouldCoalesceEventChangeDetection: t = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new de(!1)),
            (this.onMicrotaskEmpty = new de(!1)),
            (this.onStable = new de(!1)),
            (this.onError = new de(!1)),
            typeof Zone > "u")
          )
            throw new D(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            n &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && t),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function pA() {
              const e = "function" == typeof ie.requestAnimationFrame;
              let n = ie[e ? "requestAnimationFrame" : "setTimeout"],
                t = ie[e ? "cancelAnimationFrame" : "clearTimeout"];
              if (typeof Zone < "u" && n && t) {
                const r = n[Zone.__symbol__("OriginalDelegate")];
                r && (n = r);
                const o = t[Zone.__symbol__("OriginalDelegate")];
                o && (t = o);
              }
              return {
                nativeRequestAnimationFrame: n,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function yA(e) {
              const n = () => {
                !(function mA(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(ie, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                xl(e),
                                (e.isCheckStableRunning = !0),
                                Rl(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    xl(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (t, r, o, i, s, a) => {
                  if (
                    (function DA(e) {
                      return (
                        !(!Array.isArray(e) || 1 !== e.length) &&
                        !0 === e[0].data?.__ignore_ng_zone__
                      );
                    })(a)
                  )
                    return t.invokeTask(o, i, s, a);
                  try {
                    return Nm(e), t.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      n(),
                      Rm(e);
                  }
                },
                onInvoke: (t, r, o, i, s, a, u) => {
                  try {
                    return Nm(e), t.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && n(), Rm(e);
                  }
                },
                onHasTask: (t, r, o, i) => {
                  t.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          xl(e),
                          Rl(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (t, r, o, i) => (
                  t.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!ae.isInAngularZone()) throw new D(909, !1);
        }
        static assertNotInAngularZone() {
          if (ae.isInAngularZone()) throw new D(909, !1);
        }
        run(n, t, r) {
          return this._inner.run(n, t, r);
        }
        runTask(n, t, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, n, gA, Tm, Tm);
          try {
            return i.runTask(s, t, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(n, t, r) {
          return this._inner.runGuarded(n, t, r);
        }
        runOutsideAngular(n) {
          return this._outer.run(n);
        }
      }
      const gA = {};
      function Rl(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function xl(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Nm(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function Rm(e) {
        e._nesting--, Rl(e);
      }
      class vA {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new de()),
            (this.onMicrotaskEmpty = new de()),
            (this.onStable = new de()),
            (this.onError = new de());
        }
        run(n, t, r) {
          return n.apply(t, r);
        }
        runGuarded(n, t, r) {
          return n.apply(t, r);
        }
        runOutsideAngular(n) {
          return n();
        }
        runTask(n, t, r, o) {
          return n.apply(t, r);
        }
      }
      const xm = new I("", { providedIn: "root", factory: Om });
      function Om() {
        const e = E(ae);
        let n = !0;
        return (function gI(...e) {
          const n = xo(e),
            t = (function uI(e, n) {
              return "number" == typeof Qu(e) ? e.pop() : n;
            })(e, 1 / 0),
            r = e;
          return r.length ? (1 === r.length ? at(r[0]) : mr(t)(be(r, n))) : Ht;
        })(
          new me((o) => {
            (n =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                o.next(n), o.complete();
              });
          }),
          new me((o) => {
            let i;
            e.runOutsideAngular(() => {
              i = e.onStable.subscribe(() => {
                ae.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    !n &&
                      !e.hasPendingMacrotasks &&
                      !e.hasPendingMicrotasks &&
                      ((n = !0), o.next(!0));
                  });
              });
            });
            const s = e.onUnstable.subscribe(() => {
              ae.assertInAngularZone(),
                n &&
                  ((n = !1),
                  e.runOutsideAngular(() => {
                    o.next(!1);
                  }));
            });
            return () => {
              i.unsubscribe(), s.unsubscribe();
            };
          }).pipe(Hh())
        );
      }
      function pn(e) {
        return e instanceof Function ? e() : e;
      }
      let Ol = (() => {
        class e {
          constructor() {
            (this.renderDepth = 0), (this.handler = null);
          }
          begin() {
            this.handler?.validateBegin(), this.renderDepth++;
          }
          end() {
            this.renderDepth--,
              0 === this.renderDepth && this.handler?.execute();
          }
          ngOnDestroy() {
            this.handler?.destroy(), (this.handler = null);
          }
          static #e = (this.ɵprov = S({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function li(e) {
        for (; e; ) {
          e[j] |= 64;
          const n = ei(e);
          if (gc(e) && !n) return e;
          e = n;
        }
        return null;
      }
      const Vm = new I("", { providedIn: "root", factory: () => !1 });
      let pa = null;
      function $m(e, n) {
        return e[n] ?? Gm();
      }
      function Um(e, n) {
        const t = Gm();
        t.producerNode?.length && ((e[n] = pa), (t.lView = e), (pa = zm()));
      }
      const TA = {
        ...pp,
        consumerIsAlwaysLive: !0,
        consumerMarkedDirty: (e) => {
          li(e.lView);
        },
        lView: null,
      };
      function zm() {
        return Object.create(TA);
      }
      function Gm() {
        return (pa ??= zm()), pa;
      }
      const V = {};
      function K(e) {
        qm(q(), v(), We() + e, !1);
      }
      function qm(e, n, t, r) {
        if (!r)
          if (3 == (3 & n[j])) {
            const i = e.preOrderCheckHooks;
            null !== i && Rs(n, i, t);
          } else {
            const i = e.preOrderHooks;
            null !== i && xs(n, i, 0, t);
          }
        Qn(t);
      }
      function C(e, n = $.Default) {
        const t = v();
        return null === t ? M(e, n) : ig(Oe(), t, P(e), n);
      }
      function ga(e, n, t, r, o, i, s, a, u, c, l) {
        const d = n.blueprint.slice();
        return (
          (d[pe] = o),
          (d[j] = 140 | r),
          (null !== c || (e && 2048 & e[j])) && (d[j] |= 2048),
          Pp(d),
          (d[le] = d[Cr] = e),
          (d[ye] = t),
          (d[_r] = s || (e && e[_r])),
          (d[L] = a || (e && e[L])),
          (d[Sn] = u || (e && e[Sn]) || null),
          (d[Le] = i),
          (d[Bo] = (function FS() {
            return PS++;
          })()),
          (d[un] = l),
          (d[lp] = c),
          (d[ve] = 2 == n.type ? e[ve] : d),
          d
        );
      }
      function Yr(e, n, t, r, o) {
        let i = e.data[n];
        if (null === i)
          (i = (function Pl(e, n, t, r, o) {
            const i = Bp(),
              s = Ec(),
              u = (e.data[n] = (function LA(e, n, t, r, o, i) {
                let s = n ? n.injectorIndex : -1,
                  a = 0;
                return (
                  (function Mr() {
                    return null !== O.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: t,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: o,
                    attrs: i,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: n,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? i : i && i.parent, t, n, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && ((i.next = u), (u.prev = i))),
              u
            );
          })(e, n, t, r, o)),
            (function PM() {
              return O.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = t), (i.value = r), (i.attrs = o);
          const s = (function Go() {
            const e = O.lFrame,
              n = e.currentTNode;
            return e.isParent ? n : n.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return qt(i, !0), i;
      }
      function di(e, n, t, r) {
        if (0 === t) return -1;
        const o = n.length;
        for (let i = 0; i < t; i++)
          n.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Zm(e, n, t, r, o) {
        const i = $m(n, Ho),
          s = We(),
          a = 2 & r;
        try {
          Qn(-1), a && n.length > U && qm(e, n, U, !1), Gt(a ? 2 : 0, o);
          const c = a ? i : null,
            l = yc(c);
          try {
            null !== c && (c.dirty = !1), t(r, o);
          } finally {
            vc(c, l);
          }
        } finally {
          a && null === n[Ho] && Um(n, Ho), Qn(s), Gt(a ? 3 : 1, o);
        }
      }
      function Fl(e, n, t) {
        if (pc(n)) {
          const r = _t(null);
          try {
            const i = n.directiveEnd;
            for (let s = n.directiveStart; s < i; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, t[s], s);
            }
          } finally {
            _t(r);
          }
        }
      }
      function kl(e, n, t) {
        jp() &&
          ((function zA(e, n, t, r) {
            const o = t.directiveStart,
              i = t.directiveEnd;
            Zn(t) &&
              (function XA(e, n, t) {
                const r = nt(n, e),
                  o = Ym(t);
                let s = 16;
                t.signals ? (s = 4096) : t.onPush && (s = 64);
                const a = ma(
                  e,
                  ga(
                    e,
                    o,
                    null,
                    s,
                    r,
                    n,
                    null,
                    e[_r].rendererFactory.createRenderer(r, t),
                    null,
                    null,
                    null
                  )
                );
                e[n.index] = a;
              })(n, t, e.data[o + t.componentOffset]),
              e.firstCreatePass || Ps(t, n),
              Ve(r, n);
            const s = t.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                c = Xn(n, e, a, t);
              Ve(c, n),
                null !== s && JA(0, a - o, c, u, 0, s),
                Ot(u) && (lt(t.index, n)[ye] = Xn(n, e, a, t));
            }
          })(e, n, t, nt(t, n)),
          64 == (64 & t.flags) && ey(e, n, t));
      }
      function Ll(e, n, t = nt) {
        const r = n.localNames;
        if (null !== r) {
          let o = n.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? t(n, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function Ym(e) {
        const n = e.tView;
        return null === n || n.incompleteFirstPass
          ? (e.tView = Vl(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
            ))
          : n;
      }
      function Vl(e, n, t, r, o, i, s, a, u, c, l) {
        const d = U + r,
          f = d + o,
          h = (function RA(e, n) {
            const t = [];
            for (let r = 0; r < n; r++) t.push(r < e ? null : V);
            return t;
          })(d, f),
          p = "function" == typeof c ? c() : c;
        return (h[w] = {
          type: e,
          blueprint: h,
          template: t,
          queries: null,
          viewQuery: a,
          declTNode: n,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: l,
        });
      }
      let Qm = (e) => null;
      function Xm(e, n, t, r) {
        for (let o in e)
          if (e.hasOwnProperty(o)) {
            t = null === t ? {} : t;
            const i = e[o];
            null === r
              ? Jm(t, n, o, i)
              : r.hasOwnProperty(o) && Jm(t, n, r[o], i);
          }
        return t;
      }
      function Jm(e, n, t, r) {
        e.hasOwnProperty(t) ? e[t].push(n, r) : (e[t] = [n, r]);
      }
      function jl(e, n, t, r) {
        if (jp()) {
          const o = null === r ? null : { "": -1 },
            i = (function qA(e, n) {
              const t = e.directiveRegistry;
              let r = null,
                o = null;
              if (t)
                for (let i = 0; i < t.length; i++) {
                  const s = t[i];
                  if (op(n, s.selectors, !1))
                    if ((r || (r = []), Ot(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          Bl(e, n, a.length);
                      } else r.unshift(s), Bl(e, n, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(e, t);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && Km(e, n, t, s, o, a),
            o &&
              (function WA(e, n, t) {
                if (n) {
                  const r = (e.localNames = []);
                  for (let o = 0; o < n.length; o += 2) {
                    const i = t[n[o + 1]];
                    if (null == i) throw new D(-301, !1);
                    r.push(n[o], i);
                  }
                }
              })(t, r, o);
        }
        t.mergedAttrs = ko(t.mergedAttrs, t.attrs);
      }
      function Km(e, n, t, r, o, i) {
        for (let c = 0; c < r.length; c++) Fc(Ps(t, n), e, r[c].type);
        !(function YA(e, n, t) {
          (e.flags |= 1),
            (e.directiveStart = n),
            (e.directiveEnd = n + t),
            (e.providerIndexes = n);
        })(t, e.data.length, r.length);
        for (let c = 0; c < r.length; c++) {
          const l = r[c];
          l.providersResolver && l.providersResolver(l);
        }
        let s = !1,
          a = !1,
          u = di(e, n, r.length, null);
        for (let c = 0; c < r.length; c++) {
          const l = r[c];
          (t.mergedAttrs = ko(t.mergedAttrs, l.hostAttrs)),
            QA(e, t, n, u, l),
            ZA(u, l, o),
            null !== l.contentQueries && (t.flags |= 4),
            (null !== l.hostBindings ||
              null !== l.hostAttrs ||
              0 !== l.hostVars) &&
              (t.flags |= 64);
          const d = l.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(t.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ??= []).push(t.index), (a = !0)),
            u++;
        }
        !(function VA(e, n, t) {
          const o = n.directiveEnd,
            i = e.data,
            s = n.attrs,
            a = [];
          let u = null,
            c = null;
          for (let l = n.directiveStart; l < o; l++) {
            const d = i[l],
              f = t ? t.get(d) : null,
              p = f ? f.outputs : null;
            (u = Xm(d.inputs, l, u, f ? f.inputs : null)),
              (c = Xm(d.outputs, l, c, p));
            const g = null === u || null === s || rp(n) ? null : KA(u, l, s);
            a.push(g);
          }
          null !== u &&
            (u.hasOwnProperty("class") && (n.flags |= 8),
            u.hasOwnProperty("style") && (n.flags |= 16)),
            (n.initialInputs = a),
            (n.inputs = u),
            (n.outputs = c);
        })(e, t, i);
      }
      function ey(e, n, t) {
        const r = t.directiveStart,
          o = t.directiveEnd,
          i = t.index,
          s = (function kM() {
            return O.lFrame.currentDirectiveIndex;
          })();
        try {
          Qn(i);
          for (let a = r; a < o; a++) {
            const u = e.data[a],
              c = n[a];
            Ic(a),
              (null !== u.hostBindings ||
                0 !== u.hostVars ||
                null !== u.hostAttrs) &&
                GA(u, c);
          }
        } finally {
          Qn(-1), Ic(s);
        }
      }
      function GA(e, n) {
        null !== e.hostBindings && e.hostBindings(1, n);
      }
      function Bl(e, n, t) {
        (n.componentOffset = t), (e.components ??= []).push(n.index);
      }
      function ZA(e, n, t) {
        if (t) {
          if (n.exportAs)
            for (let r = 0; r < n.exportAs.length; r++) t[n.exportAs[r]] = e;
          Ot(n) && (t[""] = e);
        }
      }
      function QA(e, n, t, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = Yn(o.type)),
          s = new qo(i, Ot(o), C);
        (e.blueprint[r] = s),
          (t[r] = s),
          (function $A(e, n, t, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~n.index;
              (function UA(e) {
                let n = e.length;
                for (; n > 0; ) {
                  const t = e[--n];
                  if ("number" == typeof t && t < 0) return t;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(t, r, i);
            }
          })(e, n, r, di(e, t, o.hostVars, V), o);
      }
      function Zt(e, n, t, r, o, i) {
        const s = nt(e, n);
        !(function Hl(e, n, t, r, o, i, s) {
          if (null == i) e.removeAttribute(n, o, t);
          else {
            const a = null == s ? k(i) : s(i, r || "", o);
            e.setAttribute(n, o, a, t);
          }
        })(n[L], s, i, e.value, t, r, o);
      }
      function JA(e, n, t, r, o, i) {
        const s = i[n];
        if (null !== s)
          for (let a = 0; a < s.length; ) ty(r, t, s[a++], s[a++], s[a++]);
      }
      function ty(e, n, t, r, o) {
        const i = _t(null);
        try {
          const s = e.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (o = s[r].call(n, o)),
            null !== e.setInput ? e.setInput(n, o, t, r) : (n[r] = o);
        } finally {
          _t(i);
        }
      }
      function KA(e, n, t) {
        let r = null,
          o = 0;
        for (; o < t.length; ) {
          const i = t[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (e.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = e[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === n) {
                    r.push(i, s[a + 1], t[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function ny(e, n, t, r) {
        return [e, !0, !1, n, null, 0, r, t, null, null, null];
      }
      function ry(e, n) {
        const t = e.contentQueries;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) {
            const i = t[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              Sc(t[r]), s.contentQueries(2, n[i], i);
            }
          }
      }
      function ma(e, n) {
        return e[Vo] ? (e[cp][xt] = n) : (e[Vo] = n), (e[cp] = n), n;
      }
      function $l(e, n, t) {
        Sc(0);
        const r = _t(null);
        try {
          n(e, t);
        } finally {
          _t(r);
        }
      }
      function oy(e) {
        return e[Dr] || (e[Dr] = []);
      }
      function iy(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function ay(e, n) {
        const t = e[Sn],
          r = t ? t.get(hn, null) : null;
        r && r.handleError(n);
      }
      function Ul(e, n, t, r, o) {
        for (let i = 0; i < t.length; ) {
          const s = t[i++],
            a = t[i++];
          ty(e.data[s], n[s], r, a, o);
        }
      }
      function eT(e, n) {
        const t = lt(n, e),
          r = t[w];
        !(function tT(e, n) {
          for (let t = n.length; t < e.blueprint.length; t++)
            n.push(e.blueprint[t]);
        })(r, t);
        const o = t[pe];
        null !== o && null === t[un] && (t[un] = El(o, t[Sn])), zl(r, t, t[ye]);
      }
      function zl(e, n, t) {
        Ac(n);
        try {
          const r = e.viewQuery;
          null !== r && $l(1, r, t);
          const o = e.template;
          null !== o && Zm(e, n, o, 1, t),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && ry(e, n),
            e.staticViewQueries && $l(2, e.viewQuery, t);
          const i = e.components;
          null !== i &&
            (function nT(e, n) {
              for (let t = 0; t < n.length; t++) eT(e, n[t]);
            })(n, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (n[j] &= -5), Tc();
        }
      }
      let uy = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(t, r, o) {
            const i = typeof Zone > "u" ? null : Zone.current,
              s = (function lM(e, n, t) {
                const r = Object.create(dM);
                t && (r.consumerAllowSignalWrites = !0),
                  (r.fn = e),
                  (r.schedule = n);
                const o = (s) => {
                  r.cleanupFn = s;
                };
                return (
                  (r.ref = {
                    notify: () => vp(r),
                    run: () => {
                      if (((r.dirty = !1), r.hasRun && !Dp(r))) return;
                      r.hasRun = !0;
                      const s = yc(r);
                      try {
                        r.cleanupFn(), (r.cleanupFn = Sp), r.fn(o);
                      } finally {
                        vc(r, s);
                      }
                    },
                    cleanup: () => r.cleanupFn(),
                  }),
                  r.ref
                );
              })(
                t,
                (c) => {
                  this.all.has(c) && this.queue.set(c, i);
                },
                o
              );
            let a;
            this.all.add(s), s.notify();
            const u = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(u)), { destroy: u };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [t, r] of this.queue)
                this.queue.delete(t), r ? r.run(() => t.run()) : t.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
          static #e = (this.ɵprov = S({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          }));
        }
        return e;
      })();
      function ya(e, n, t) {
        let r = t ? e.styles : null,
          o = t ? e.classes : null,
          i = 0;
        if (null !== n)
          for (let s = 0; s < n.length; s++) {
            const a = n[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = Ju(o, a))
              : 2 == i && (r = Ju(r, a + ": " + n[++s] + ";"));
          }
        t ? (e.styles = r) : (e.stylesWithoutHost = r),
          t ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function fi(e, n, t, r, o = !1) {
        for (; null !== t; ) {
          const i = n[t.index];
          null !== i && r.push(se(i)), Ge(i) && cy(i, r);
          const s = t.type;
          if (8 & s) fi(e, n, t.child, r);
          else if (32 & s) {
            const a = Wc(t, n);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = zg(n, t);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = ei(n[ve]);
              fi(u[w], u, a, r, !0);
            }
          }
          t = o ? t.projectionNext : t.next;
        }
        return r;
      }
      function cy(e, n) {
        for (let t = Re; t < e.length; t++) {
          const r = e[t],
            o = r[w].firstChild;
          null !== o && fi(r[w], r, o, n);
        }
        e[zt] !== e[pe] && n.push(e[zt]);
      }
      function va(e, n, t, r = !0) {
        const o = n[_r],
          i = o.rendererFactory,
          s = o.afterRenderEventManager;
        i.begin?.(), s?.begin();
        try {
          ly(e, n, e.template, t);
        } catch (u) {
          throw (r && ay(n, u), u);
        } finally {
          i.end?.(), o.effectManager?.flush(), s?.end();
        }
      }
      function ly(e, n, t, r) {
        const o = n[j];
        if (256 != (256 & o)) {
          n[_r].effectManager?.flush(), Ac(n);
          try {
            Pp(n),
              (function $p(e) {
                return (O.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== t && Zm(e, n, t, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && Rs(n, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && xs(n, c, 0, null), Nc(n, 0);
            }
            if (
              ((function iT(e) {
                for (let n = xg(e); null !== n; n = Og(n)) {
                  if (!n[dp]) continue;
                  const t = n[Er];
                  for (let r = 0; r < t.length; r++) {
                    CM(t[r]);
                  }
                }
              })(n),
              dy(n, 2),
              null !== e.contentQueries && ry(e, n),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && Rs(n, c);
            } else {
              const c = e.contentHooks;
              null !== c && xs(n, c, 1), Nc(n, 1);
            }
            !(function NA(e, n) {
              const t = e.hostBindingOpCodes;
              if (null === t) return;
              const r = $m(n, $o);
              try {
                for (let o = 0; o < t.length; o++) {
                  const i = t[o];
                  if (i < 0) Qn(~i);
                  else {
                    const s = i,
                      a = t[++o],
                      u = t[++o];
                    FM(a, s), (r.dirty = !1);
                    const c = yc(r);
                    try {
                      u(2, n[s]);
                    } finally {
                      vc(r, c);
                    }
                  }
                }
              } finally {
                null === n[$o] && Um(n, $o), Qn(-1);
              }
            })(e, n);
            const a = e.components;
            null !== a && hy(n, a, 0);
            const u = e.viewQuery;
            if ((null !== u && $l(2, u, r), s)) {
              const c = e.viewCheckHooks;
              null !== c && Rs(n, c);
            } else {
              const c = e.viewHooks;
              null !== c && xs(n, c, 2), Nc(n, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (n[j] &= -73),
              Fp(n);
          } finally {
            Tc();
          }
        }
      }
      function dy(e, n) {
        for (let t = xg(e); null !== t; t = Og(t))
          for (let r = Re; r < t.length; r++) fy(t[r], n);
      }
      function sT(e, n, t) {
        fy(lt(n, e), t);
      }
      function fy(e, n) {
        if (
          !(function DM(e) {
            return 128 == (128 & e[j]);
          })(e)
        )
          return;
        const t = e[w],
          r = e[j];
        if ((80 & r && 0 === n) || 1024 & r || 2 === n)
          ly(t, e, t.template, e[ye]);
        else if (e[Lo] > 0) {
          dy(e, 1);
          const o = t.components;
          null !== o && hy(e, o, 1);
        }
      }
      function hy(e, n, t) {
        for (let r = 0; r < n.length; r++) sT(e, n[r], t);
      }
      class hi {
        get rootNodes() {
          const n = this._lView,
            t = n[w];
          return fi(t, n, t.firstChild, []);
        }
        constructor(n, t) {
          (this._lView = n),
            (this._cdRefInjectingView = t),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[ye];
        }
        set context(n) {
          this._lView[ye] = n;
        }
        get destroyed() {
          return 256 == (256 & this._lView[j]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const n = this._lView[le];
            if (Ge(n)) {
              const t = n[8],
                r = t ? t.indexOf(this) : -1;
              r > -1 && (Qs(n, r), Vs(t, r));
            }
            this._attachedToViewContainer = !1;
          }
          Yc(this._lView[w], this._lView);
        }
        onDestroy(n) {
          !(function Lp(e, n) {
            if (256 == (256 & e[j])) throw new D(911, !1);
            null === e[An] && (e[An] = []), e[An].push(n);
          })(this._lView, n);
        }
        markForCheck() {
          li(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[j] &= -129;
        }
        reattach() {
          this._lView[j] |= 128;
        }
        detectChanges() {
          va(this._lView[w], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new D(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function YS(e, n) {
              ni(e, n, n[L], 2, null, null);
            })(this._lView[w], this._lView);
        }
        attachToAppRef(n) {
          if (this._attachedToViewContainer) throw new D(902, !1);
          this._appRef = n;
        }
      }
      class aT extends hi {
        constructor(n) {
          super(n), (this._view = n);
        }
        detectChanges() {
          const n = this._view;
          va(n[w], n, n[ye], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class py extends fa {
        constructor(n) {
          super(), (this.ngModule = n);
        }
        resolveComponentFactory(n) {
          const t = G(n);
          return new pi(t, this.ngModule);
        }
      }
      function gy(e) {
        const n = [];
        for (let t in e)
          e.hasOwnProperty(t) && n.push({ propName: e[t], templateName: t });
        return n;
      }
      class cT {
        constructor(n, t) {
          (this.injector = n), (this.parentInjector = t);
        }
        get(n, t, r) {
          r = _s(r);
          const o = this.injector.get(n, Ml, r);
          return o !== Ml || t === Ml ? o : this.parentInjector.get(n, t, r);
        }
      }
      class pi extends _m {
        get inputs() {
          const n = this.componentDef,
            t = n.inputTransforms,
            r = gy(n.inputs);
          if (null !== t)
            for (const o of r)
              t.hasOwnProperty(o.propName) && (o.transform = t[o.propName]);
          return r;
        }
        get outputs() {
          return gy(this.componentDef.outputs);
        }
        constructor(n, t) {
          super(),
            (this.componentDef = n),
            (this.ngModule = t),
            (this.componentType = n.type),
            (this.selector = (function GI(e) {
              return e.map(zI).join(",");
            })(n.selectors)),
            (this.ngContentSelectors = n.ngContentSelectors
              ? n.ngContentSelectors
              : []),
            (this.isBoundToModule = !!t);
        }
        create(n, t, r, o) {
          let i = (o = o || this.ngModule) instanceof ft ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new cT(n, i) : n,
            a = s.get(wm, null);
          if (null === a) throw new D(407, !1);
          const d = {
              rendererFactory: a,
              sanitizer: s.get(iA, null),
              effectManager: s.get(uy, null),
              afterRenderEventManager: s.get(Ol, null),
            },
            f = a.createRenderer(null, this.componentDef),
            h = this.componentDef.selectors[0][0] || "div",
            p = r
              ? (function xA(e, n, t, r) {
                  const i = r.get(Vm, !1) || t === Nt.ShadowDom,
                    s = e.selectRootElement(n, i);
                  return (
                    (function OA(e) {
                      Qm(e);
                    })(s),
                    s
                  );
                })(f, r, this.componentDef.encapsulation, s)
              : Ys(
                  f,
                  h,
                  (function uT(e) {
                    const n = e.toLowerCase();
                    return "svg" === n ? "svg" : "math" === n ? "math" : null;
                  })(h)
                ),
            _ = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528;
          let m = null;
          null !== p && (m = El(p, s, !0));
          const b = Vl(0, null, null, 1, 0, null, null, null, null, null, null),
            A = ga(null, b, null, _, null, null, d, f, s, null, m);
          let H, Ae;
          Ac(A);
          try {
            const rn = this.componentDef;
            let gr,
              ph = null;
            rn.findHostDirectiveDefs
              ? ((gr = []),
                (ph = new Map()),
                rn.findHostDirectiveDefs(rn, gr, ph),
                gr.push(rn))
              : (gr = [rn]);
            const n2 = (function dT(e, n) {
                const t = e[w],
                  r = U;
                return (e[r] = n), Yr(t, r, 2, "#host", null);
              })(A, p),
              r2 = (function fT(e, n, t, r, o, i, s) {
                const a = o[w];
                !(function hT(e, n, t, r) {
                  for (const o of e)
                    n.mergedAttrs = ko(n.mergedAttrs, o.hostAttrs);
                  null !== n.mergedAttrs &&
                    (ya(n, n.mergedAttrs, !0), null !== t && Zg(r, t, n));
                })(r, e, n, s);
                let u = null;
                null !== n && (u = El(n, o[Sn]));
                const c = i.rendererFactory.createRenderer(n, t);
                let l = 16;
                t.signals ? (l = 4096) : t.onPush && (l = 64);
                const d = ga(
                  o,
                  Ym(t),
                  null,
                  l,
                  o[e.index],
                  e,
                  i,
                  c,
                  null,
                  null,
                  u
                );
                return (
                  a.firstCreatePass && Bl(a, e, r.length - 1),
                  ma(o, d),
                  (o[e.index] = d)
                );
              })(n2, p, rn, gr, A, d, f);
            (Ae = Op(b, U)),
              p &&
                (function gT(e, n, t, r) {
                  if (r) fc(e, t, ["ng-version", sA.full]);
                  else {
                    const { attrs: o, classes: i } = (function qI(e) {
                      const n = [],
                        t = [];
                      let r = 1,
                        o = 2;
                      for (; r < e.length; ) {
                        let i = e[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && n.push(i, e[++r])
                            : 8 === o && t.push(i);
                        else {
                          if (!Rt(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: n, classes: t };
                    })(n.selectors[0]);
                    o && fc(e, t, o),
                      i && i.length > 0 && Wg(e, t, i.join(" "));
                  }
                })(f, rn, p, r),
              void 0 !== t &&
                (function mT(e, n, t) {
                  const r = (e.projection = []);
                  for (let o = 0; o < n.length; o++) {
                    const i = t[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(Ae, this.ngContentSelectors, t),
              (H = (function pT(e, n, t, r, o, i) {
                const s = Oe(),
                  a = o[w],
                  u = nt(s, o);
                Km(a, o, s, t, null, r);
                for (let l = 0; l < t.length; l++)
                  Ve(Xn(o, a, s.directiveStart + l, s), o);
                ey(a, o, s), u && Ve(u, o);
                const c = Xn(o, a, s.directiveStart + s.componentOffset, s);
                if (((e[ye] = o[ye] = c), null !== i))
                  for (const l of i) l(c, n);
                return Fl(a, s, e), c;
              })(r2, rn, gr, ph, A, [yT])),
              zl(b, A, null);
          } finally {
            Tc();
          }
          return new lT(this.componentType, H, qr(Ae, A), A, Ae);
        }
      }
      class lT extends K0 {
        constructor(n, t, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = t),
            (this.hostView = this.changeDetectorRef = new aT(o)),
            (this.componentType = n);
        }
        setInput(n, t) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[n])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(n) &&
                Object.is(this.previousInputValues.get(n), t))
            )
              return;
            const i = this._rootLView;
            Ul(i[w], i, o, n, t),
              this.previousInputValues.set(n, t),
              li(lt(this._tNode.index, i));
          }
        }
        get injector() {
          return new Ze(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(n) {
          this.hostView.onDestroy(n);
        }
      }
      function yT() {
        const e = Oe();
        Ns(v()[w], e);
      }
      function ee(e) {
        let n = (function my(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          t = !0;
        const r = [e];
        for (; n; ) {
          let o;
          if (Ot(e)) o = n.ɵcmp || n.ɵdir;
          else {
            if (n.ɵcmp) throw new D(903, !1);
            o = n.ɵdir;
          }
          if (o) {
            if (t) {
              r.push(o);
              const s = e;
              (s.inputs = Da(e.inputs)),
                (s.inputTransforms = Da(e.inputTransforms)),
                (s.declaredInputs = Da(e.declaredInputs)),
                (s.outputs = Da(e.outputs));
              const a = o.hostBindings;
              a && CT(e, a);
              const u = o.viewQuery,
                c = o.contentQueries;
              if (
                (u && DT(e, u),
                c && _T(e, c),
                ps(e.inputs, o.inputs),
                ps(e.declaredInputs, o.declaredInputs),
                ps(e.outputs, o.outputs),
                null !== o.inputTransforms &&
                  (null === s.inputTransforms && (s.inputTransforms = {}),
                  ps(s.inputTransforms, o.inputTransforms)),
                Ot(o) && o.data.animation)
              ) {
                const l = e.data;
                l.animation = (l.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === ee && (t = !1);
              }
          }
          n = Object.getPrototypeOf(n);
        }
        !(function vT(e) {
          let n = 0,
            t = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = n += o.hostVars),
              (o.hostAttrs = ko(o.hostAttrs, (t = ko(t, o.hostAttrs))));
          }
        })(r);
      }
      function Da(e) {
        return e === $t ? {} : e === W ? [] : e;
      }
      function DT(e, n) {
        const t = e.viewQuery;
        e.viewQuery = t
          ? (r, o) => {
              n(r, o), t(r, o);
            }
          : n;
      }
      function _T(e, n) {
        const t = e.contentQueries;
        e.contentQueries = t
          ? (r, o, i) => {
              n(r, o, i), t(r, o, i);
            }
          : n;
      }
      function CT(e, n) {
        const t = e.hostBindings;
        e.hostBindings = t
          ? (r, o) => {
              n(r, o), t(r, o);
            }
          : n;
      }
      function _y(e) {
        const n = e.inputConfig,
          t = {};
        for (const r in n)
          if (n.hasOwnProperty(r)) {
            const o = n[r];
            Array.isArray(o) && o[2] && (t[r] = o[2]);
          }
        e.inputTransforms = t;
      }
      function _a(e) {
        return (
          !!(function Gl(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function Yt(e, n, t) {
        return (e[n] = t);
      }
      function je(e, n, t) {
        return !Object.is(e[n], t) && ((e[n] = t), !0);
      }
      function Qt(e, n, t, r) {
        const o = v();
        return je(o, Sr(), n) && (q(), Zt(he(), o, e, n, t, r)), Qt;
      }
      function io(e, n, t, r, o, i, s, a) {
        const u = v(),
          c = q(),
          l = e + U,
          d = c.firstCreatePass
            ? (function qT(e, n, t, r, o, i, s, a, u) {
                const c = n.consts,
                  l = Yr(n, e, 4, s || null, Nn(c, a));
                jl(n, t, l, Nn(c, u)), Ns(n, l);
                const d = (l.tView = Vl(
                  2,
                  l,
                  r,
                  o,
                  i,
                  n.directiveRegistry,
                  n.pipeRegistry,
                  null,
                  n.schemas,
                  c,
                  null
                ));
                return (
                  null !== n.queries &&
                    (n.queries.template(n, l),
                    (d.queries = n.queries.embeddedTView(l))),
                  l
                );
              })(l, c, u, n, t, r, o, i, s)
            : c.data[l];
        qt(d, !1);
        const f = Oy(c, u, d, e);
        Ts() && Js(c, u, f, d),
          Ve(f, u),
          ma(u, (u[l] = ny(f, u, f, d))),
          Is(d) && kl(c, u, d),
          null != s && Ll(u, d, a);
      }
      let Oy = function Py(e, n, t, r) {
        return Rn(!0), n[L].createComment("");
      };
      function Ce(e, n, t) {
        const r = v();
        return (
          je(r, Sr(), n) &&
            (function gt(e, n, t, r, o, i, s, a) {
              const u = nt(n, t);
              let l,
                c = n.inputs;
              !a && null != c && (l = c[r])
                ? (Ul(e, t, l, r, o),
                  Zn(n) &&
                    (function BA(e, n) {
                      const t = lt(n, e);
                      16 & t[j] || (t[j] |= 64);
                    })(t, n.index))
                : 3 & n.type &&
                  ((r = (function jA(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, n.value || "", r) : o),
                  i.setProperty(u, r, o));
            })(q(), he(), r, e, n, r[L], t, !1),
          Ce
        );
      }
      function Xl(e, n, t, r, o) {
        const s = o ? "class" : "style";
        Ul(e, t, n.inputs[s], s, r);
      }
      function T(e, n, t, r) {
        const o = v(),
          i = q(),
          s = U + e,
          a = o[L],
          u = i.firstCreatePass
            ? (function XT(e, n, t, r, o, i) {
                const s = n.consts,
                  u = Yr(n, e, 2, r, Nn(s, o));
                return (
                  jl(n, t, u, Nn(s, i)),
                  null !== u.attrs && ya(u, u.attrs, !1),
                  null !== u.mergedAttrs && ya(u, u.mergedAttrs, !0),
                  null !== n.queries && n.queries.elementStart(n, u),
                  u
                );
              })(s, i, o, n, t, r)
            : i.data[s],
          c = Fy(i, o, u, a, n, e);
        o[s] = c;
        const l = Is(u);
        return (
          qt(u, !0),
          Zg(a, c, u),
          32 != (32 & u.flags) && Ts() && Js(i, o, c, u),
          0 ===
            (function EM() {
              return O.lFrame.elementDepthCount;
            })() && Ve(c, o),
          (function bM() {
            O.lFrame.elementDepthCount++;
          })(),
          l && (kl(i, o, u), Fl(i, u, o)),
          null !== r && Ll(o, u),
          T
        );
      }
      function N() {
        let e = Oe();
        Ec()
          ? (function bc() {
              O.lFrame.isParent = !1;
            })()
          : ((e = e.parent), qt(e, !1));
        const n = e;
        (function MM(e) {
          return O.skipHydrationRootTNode === e;
        })(n) &&
          (function NM() {
            O.skipHydrationRootTNode = null;
          })(),
          (function IM() {
            O.lFrame.elementDepthCount--;
          })();
        const t = q();
        return (
          t.firstCreatePass && (Ns(t, e), pc(e) && t.queries.elementEnd(e)),
          null != n.classesWithoutHost &&
            (function WM(e) {
              return 0 != (8 & e.flags);
            })(n) &&
            Xl(t, n, v(), n.classesWithoutHost, !0),
          null != n.stylesWithoutHost &&
            (function ZM(e) {
              return 0 != (16 & e.flags);
            })(n) &&
            Xl(t, n, v(), n.stylesWithoutHost, !1),
          N
        );
      }
      function bt(e, n, t, r) {
        return T(e, n, t, r), N(), bt;
      }
      let Fy = (e, n, t, r, o, i) => (
        Rn(!0),
        Ys(
          r,
          o,
          (function Qp() {
            return O.lFrame.currentNamespace;
          })()
        )
      );
      function Di(e) {
        return !!e && "function" == typeof e.then;
      }
      function Vy(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function Fe(e, n, t, r) {
        const o = v(),
          i = q(),
          s = Oe();
        return (
          (function By(e, n, t, r, o, i, s) {
            const a = Is(r),
              c = e.firstCreatePass && iy(e),
              l = n[ye],
              d = oy(n);
            let f = !0;
            if (3 & r.type || s) {
              const g = nt(r, n),
                y = s ? s(g) : g,
                _ = d.length,
                m = s ? (A) => s(se(A[r.index])) : r.index;
              let b = null;
              if (
                (!s &&
                  a &&
                  (b = (function oN(e, n, t, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === t && o[i + 1] === r) {
                          const a = n[Dr],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, n, o, r.index)),
                null !== b)
              )
                ((b.__ngLastListenerFn__ || b).__ngNextListenerFn__ = i),
                  (b.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = $y(r, n, l, i, !1);
                const A = t.listen(y, o, i);
                d.push(i, A), c && c.push(o, m, _, _ + 1);
              }
            } else i = $y(r, n, l, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let y = 0; y < g; y += 2) {
                  const H = n[p[y]][p[y + 1]].subscribe(i),
                    Ae = d.length;
                  d.push(i, H), c && c.push(o, r.index, Ae, -(Ae + 1));
                }
            }
          })(i, o, o[L], s, e, n, r),
          Fe
        );
      }
      function Hy(e, n, t, r) {
        try {
          return Gt(6, n, t), !1 !== t(r);
        } catch (o) {
          return ay(e, o), !1;
        } finally {
          Gt(7, n, t);
        }
      }
      function $y(e, n, t, r, o) {
        return function i(s) {
          if (s === Function) return r;
          li(e.componentOffset > -1 ? lt(e.index, n) : n);
          let u = Hy(n, t, r, s),
            c = i.__ngNextListenerFn__;
          for (; c; ) (u = Hy(n, t, c, s) && u), (c = c.__ngNextListenerFn__);
          return o && !1 === u && s.preventDefault(), u;
        };
      }
      function Ia(e = 1) {
        return (function VM(e) {
          return (O.lFrame.contextLView = (function jM(e, n) {
            for (; e > 0; ) (n = n[Cr]), e--;
            return n;
          })(e, O.lFrame.contextLView))[ye];
        })(e);
      }
      function Ma(e, n) {
        return (e << 17) | (n << 2);
      }
      function Pn(e) {
        return (e >> 17) & 32767;
      }
      function td(e) {
        return 2 | e;
      }
      function nr(e) {
        return (131068 & e) >> 2;
      }
      function nd(e, n) {
        return (-131069 & e) | (n << 2);
      }
      function rd(e) {
        return 1 | e;
      }
      function Jy(e, n, t, r, o) {
        const i = e[t + 1],
          s = null === n;
        let a = r ? Pn(i) : nr(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const l = e[a + 1];
          hN(e[a], n) && ((u = !0), (e[a + 1] = r ? rd(l) : td(l))),
            (a = r ? Pn(l) : nr(l));
        }
        u && (e[t + 1] = r ? td(i) : rd(i));
      }
      function hN(e, n) {
        return (
          null === e ||
          null == n ||
          (Array.isArray(e) ? e[1] : e) === n ||
          (!(!Array.isArray(e) || "string" != typeof n) && Fr(e, n) >= 0)
        );
      }
      function Sa(e, n) {
        return (
          (function Pt(e, n, t, r) {
            const o = v(),
              i = q(),
              s = (function ln(e) {
                const n = O.lFrame,
                  t = n.bindingIndex;
                return (n.bindingIndex = n.bindingIndex + e), t;
              })(2);
            i.firstUpdatePass &&
              (function av(e, n, t, r) {
                const o = e.data;
                if (null === o[t + 1]) {
                  const i = o[We()],
                    s = (function sv(e, n) {
                      return n >= e.expandoStartIndex;
                    })(e, t);
                  (function dv(e, n) {
                    return 0 != (e.flags & (n ? 8 : 16));
                  })(i, r) &&
                    null === n &&
                    !s &&
                    (n = !1),
                    (n = (function wN(e, n, t, r) {
                      const o = (function Mc(e) {
                        const n = O.lFrame.currentDirectiveIndex;
                        return -1 === n ? null : e[n];
                      })(e);
                      let i = r ? n.residualClasses : n.residualStyles;
                      if (null === o)
                        0 === (r ? n.classBindings : n.styleBindings) &&
                          ((t = _i((t = od(null, e, n, t, r)), n.attrs, r)),
                          (i = null));
                      else {
                        const s = n.directiveStylingLast;
                        if (-1 === s || e[s] !== o)
                          if (((t = od(o, e, n, t, r)), null === i)) {
                            let u = (function EN(e, n, t) {
                              const r = t ? n.classBindings : n.styleBindings;
                              if (0 !== nr(r)) return e[Pn(r)];
                            })(e, n, r);
                            void 0 !== u &&
                              Array.isArray(u) &&
                              ((u = od(null, e, n, u[1], r)),
                              (u = _i(u, n.attrs, r)),
                              (function bN(e, n, t, r) {
                                e[Pn(t ? n.classBindings : n.styleBindings)] =
                                  r;
                              })(e, n, r, u));
                          } else
                            i = (function IN(e, n, t) {
                              let r;
                              const o = n.directiveEnd;
                              for (
                                let i = 1 + n.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = _i(r, e[i].hostAttrs, t);
                              return _i(r, n.attrs, t);
                            })(e, n, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (n.residualClasses = i)
                            : (n.residualStyles = i)),
                        t
                      );
                    })(o, i, n, r)),
                    (function dN(e, n, t, r, o, i) {
                      let s = i ? n.classBindings : n.styleBindings,
                        a = Pn(s),
                        u = nr(s);
                      e[r] = t;
                      let l,
                        c = !1;
                      if (
                        (Array.isArray(t)
                          ? ((l = t[1]),
                            (null === l || Fr(t, l) > 0) && (c = !0))
                          : (l = t),
                        o)
                      )
                        if (0 !== u) {
                          const f = Pn(e[a + 1]);
                          (e[r + 1] = Ma(f, a)),
                            0 !== f && (e[f + 1] = nd(e[f + 1], r)),
                            (e[a + 1] = (function cN(e, n) {
                              return (131071 & e) | (n << 17);
                            })(e[a + 1], r));
                        } else
                          (e[r + 1] = Ma(a, 0)),
                            0 !== a && (e[a + 1] = nd(e[a + 1], r)),
                            (a = r);
                      else
                        (e[r + 1] = Ma(u, 0)),
                          0 === a ? (a = r) : (e[u + 1] = nd(e[u + 1], r)),
                          (u = r);
                      c && (e[r + 1] = td(e[r + 1])),
                        Jy(e, l, r, !0),
                        Jy(e, l, r, !1),
                        (function fN(e, n, t, r, o) {
                          const i = o ? e.residualClasses : e.residualStyles;
                          null != i &&
                            "string" == typeof n &&
                            Fr(i, n) >= 0 &&
                            (t[r + 1] = rd(t[r + 1]));
                        })(n, l, e, r, i),
                        (s = Ma(a, u)),
                        i ? (n.classBindings = s) : (n.styleBindings = s);
                    })(o, i, n, t, s, r);
                }
              })(i, e, s, r),
              n !== V &&
                je(o, s, n) &&
                (function cv(e, n, t, r, o, i, s, a) {
                  if (!(3 & n.type)) return;
                  const u = e.data,
                    c = u[a + 1],
                    l = (function lN(e) {
                      return 1 == (1 & e);
                    })(c)
                      ? lv(u, n, t, o, nr(c), s)
                      : void 0;
                  Aa(l) ||
                    (Aa(i) ||
                      ((function uN(e) {
                        return 2 == (2 & e);
                      })(c) &&
                        (i = lv(u, null, t, o, a, s))),
                    (function s0(e, n, t, r, o) {
                      if (n) o ? e.addClass(t, r) : e.removeClass(t, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : xn.DashCase;
                        null == o
                          ? e.removeStyle(t, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= xn.Important)),
                            e.setStyle(t, r, o, i));
                      }
                    })(r, s, As(We(), t), o, i));
                })(
                  i,
                  i.data[We()],
                  o,
                  o[L],
                  e,
                  (o[s + 1] = (function TN(e, n) {
                    return (
                      null == e ||
                        "" === e ||
                        ("string" == typeof n
                          ? (e += n)
                          : "object" == typeof e && (e = Ie(On(e)))),
                      e
                    );
                  })(n, t)),
                  r,
                  s
                );
          })(e, n, null, !0),
          Sa
        );
      }
      function od(e, n, t, r, o) {
        let i = null;
        const s = t.directiveEnd;
        let a = t.directiveStylingLast;
        for (
          -1 === a ? (a = t.directiveStart) : a++;
          a < s && ((i = n[a]), (r = _i(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (t.directiveStylingLast = a), r;
      }
      function _i(e, n, t) {
        const r = t ? 1 : 2;
        let o = -1;
        if (null !== n)
          for (let i = 0; i < n.length; i++) {
            const s = n[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                dt(e, s, !!t || n[++i]));
          }
        return void 0 === e ? null : e;
      }
      function lv(e, n, t, r, o, i) {
        const s = null === n;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            c = Array.isArray(u),
            l = c ? u[1] : u,
            d = null === l;
          let f = t[o + 1];
          f === V && (f = d ? W : void 0);
          let h = d ? Vc(f, r) : l === r ? f : void 0;
          if ((c && !Aa(h) && (h = Vc(u, r)), Aa(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? Pn(p) : nr(p);
        }
        if (null !== n) {
          let u = i ? n.residualClasses : n.residualStyles;
          null != u && (a = Vc(u, r));
        }
        return a;
      }
      function Aa(e) {
        return void 0 !== e;
      }
      function z(e, n = "") {
        const t = v(),
          r = q(),
          o = e + U,
          i = r.firstCreatePass ? Yr(r, o, 1, n, null) : r.data[o],
          s = fv(r, t, i, n, e);
        (t[o] = s), Ts() && Js(r, t, s, i), qt(i, !1);
      }
      let fv = (e, n, t, r, o) => (
        Rn(!0),
        (function Zs(e, n) {
          return e.createText(n);
        })(n[L], r)
      );
      function kt(e) {
        return Ci("", e, ""), kt;
      }
      function Ci(e, n, t) {
        const r = v(),
          o = (function Xr(e, n, t, r) {
            return je(e, Sr(), t) ? n + k(t) + r : V;
          })(r, e, n, t);
        return (
          o !== V &&
            (function gn(e, n, t) {
              const r = As(n, e);
              !(function Fg(e, n, t) {
                e.setValue(n, t);
              })(e[L], r, t);
            })(r, We(), o),
          Ci
        );
      }
      const rr = void 0;
      var XN = [
        "en",
        [["a", "p"], ["AM", "PM"], rr],
        [["AM", "PM"], rr, rr],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        rr,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        rr,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", rr, "{1} 'at' {0}", rr],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function QN(e) {
          const t = Math.floor(Math.abs(e)),
            r = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === t && 0 === r ? 1 : 5;
        },
      ];
      let ao = {};
      function Ye(e) {
        const n = (function JN(e) {
          return e.toLowerCase().replace(/_/g, "-");
        })(e);
        let t = Ov(n);
        if (t) return t;
        const r = n.split("-")[0];
        if (((t = Ov(r)), t)) return t;
        if ("en" === r) return XN;
        throw new D(701, !1);
      }
      function Ov(e) {
        return (
          e in ao ||
            (ao[e] =
              ie.ng &&
              ie.ng.common &&
              ie.ng.common.locales &&
              ie.ng.common.locales[e]),
          ao[e]
        );
      }
      var ue = (function (e) {
        return (
          (e[(e.LocaleId = 0)] = "LocaleId"),
          (e[(e.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
          (e[(e.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
          (e[(e.DaysFormat = 3)] = "DaysFormat"),
          (e[(e.DaysStandalone = 4)] = "DaysStandalone"),
          (e[(e.MonthsFormat = 5)] = "MonthsFormat"),
          (e[(e.MonthsStandalone = 6)] = "MonthsStandalone"),
          (e[(e.Eras = 7)] = "Eras"),
          (e[(e.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
          (e[(e.WeekendRange = 9)] = "WeekendRange"),
          (e[(e.DateFormat = 10)] = "DateFormat"),
          (e[(e.TimeFormat = 11)] = "TimeFormat"),
          (e[(e.DateTimeFormat = 12)] = "DateTimeFormat"),
          (e[(e.NumberSymbols = 13)] = "NumberSymbols"),
          (e[(e.NumberFormats = 14)] = "NumberFormats"),
          (e[(e.CurrencyCode = 15)] = "CurrencyCode"),
          (e[(e.CurrencySymbol = 16)] = "CurrencySymbol"),
          (e[(e.CurrencyName = 17)] = "CurrencyName"),
          (e[(e.Currencies = 18)] = "Currencies"),
          (e[(e.Directionality = 19)] = "Directionality"),
          (e[(e.PluralCase = 20)] = "PluralCase"),
          (e[(e.ExtraData = 21)] = "ExtraData"),
          e
        );
      })(ue || {});
      const uo = "en-US";
      let Pv = uo;
      function ad(e, n, t, r, o) {
        if (((e = P(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) ad(e[i], n, t, r, o);
        else {
          const i = q(),
            s = v(),
            a = Oe();
          let u = Kn(e) ? e : P(e.provide);
          const c = pm(e),
            l = 1048575 & a.providerIndexes,
            d = a.directiveStart,
            f = a.providerIndexes >> 20;
          if (Kn(e) || !e.multi) {
            const h = new qo(c, o, C),
              p = cd(u, n, o ? l : l + f, d);
            -1 === p
              ? (Fc(Ps(a, s), i, u),
                ud(i, e, n.length),
                n.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                t.push(h),
                s.push(h))
              : ((t[p] = h), (s[p] = h));
          } else {
            const h = cd(u, n, l + f, d),
              p = cd(u, n, l, l + f),
              y = p >= 0 && t[p];
            if ((o && !y) || (!o && !(h >= 0 && t[h]))) {
              Fc(Ps(a, s), i, u);
              const _ = (function QR(e, n, t, r, o) {
                const i = new qo(e, t, C);
                return (
                  (i.multi = []),
                  (i.index = n),
                  (i.componentProviders = 0),
                  iD(i, o, r && !t),
                  i
                );
              })(o ? YR : ZR, t.length, o, r, c);
              !o && y && (t[p].providerFactory = _),
                ud(i, e, n.length, 0),
                n.push(u),
                a.directiveStart++,
                a.directiveEnd++,
                o && (a.providerIndexes += 1048576),
                t.push(_),
                s.push(_);
            } else ud(i, e, h > -1 ? h : p, iD(t[o ? p : h], c, !o && r));
            !o && r && y && t[p].componentProviders++;
          }
        }
      }
      function ud(e, n, t, r) {
        const o = Kn(n),
          i = (function k0(e) {
            return !!e.useClass;
          })(n);
        if (o || i) {
          const u = (i ? P(n.useClass) : n).prototype.ngOnDestroy;
          if (u) {
            const c = e.destroyHooks || (e.destroyHooks = []);
            if (!o && n.multi) {
              const l = c.indexOf(t);
              -1 === l ? c.push(t, [r, u]) : c[l + 1].push(r, u);
            } else c.push(t, u);
          }
        }
      }
      function iD(e, n, t) {
        return t && e.componentProviders++, e.multi.push(n) - 1;
      }
      function cd(e, n, t, r) {
        for (let o = t; o < r; o++) if (n[o] === e) return o;
        return -1;
      }
      function ZR(e, n, t, r) {
        return ld(this.multi, []);
      }
      function YR(e, n, t, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = Xn(t, t[w], this.providerFactory.index, r);
          (i = a.slice(0, s)), ld(o, i);
          for (let u = s; u < a.length; u++) i.push(a[u]);
        } else (i = []), ld(o, i);
        return i;
      }
      function ld(e, n) {
        for (let t = 0; t < e.length; t++) n.push((0, e[t])());
        return n;
      }
      function fe(e, n = []) {
        return (t) => {
          t.providersResolver = (r, o) =>
            (function WR(e, n, t) {
              const r = q();
              if (r.firstCreatePass) {
                const o = Ot(e);
                ad(t, r.data, r.blueprint, o, !0),
                  ad(n, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, n);
        };
      }
      class or {}
      class sD {}
      class dd extends or {
        constructor(n, t, r) {
          super(),
            (this._parent = t),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new py(this));
          const o = ct(n);
          (this._bootstrapComponents = pn(o.bootstrap)),
            (this._r3Injector = Sm(
              n,
              t,
              [
                { provide: or, useValue: this },
                { provide: fa, useValue: this.componentFactoryResolver },
                ...r,
              ],
              Ie(n),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(n));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const n = this._r3Injector;
          !n.destroyed && n.destroy(),
            this.destroyCbs.forEach((t) => t()),
            (this.destroyCbs = null);
        }
        onDestroy(n) {
          this.destroyCbs.push(n);
        }
      }
      class fd extends sD {
        constructor(n) {
          super(), (this.moduleType = n);
        }
        create(n) {
          return new dd(this.moduleType, n, []);
        }
      }
      class aD extends or {
        constructor(n) {
          super(),
            (this.componentFactoryResolver = new py(this)),
            (this.instance = null);
          const t = new $r(
            [
              ...n.providers,
              { provide: or, useValue: this },
              { provide: fa, useValue: this.componentFactoryResolver },
            ],
            n.parent || ia(),
            n.debugName,
            new Set(["environment"])
          );
          (this.injector = t),
            n.runEnvironmentInitializers && t.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(n) {
          this.injector.onDestroy(n);
        }
      }
      function hd(e, n, t = null) {
        return new aD({
          providers: e,
          parent: n,
          debugName: t,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let KR = (() => {
        class e {
          constructor(t) {
            (this._injector = t), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(t) {
            if (!t.standalone) return null;
            if (!this.cachedInjectors.has(t)) {
              const r = lm(0, t.type),
                o =
                  r.length > 0
                    ? hd([r], this._injector, `Standalone[${t.type.name}]`)
                    : null;
              this.cachedInjectors.set(t, o);
            }
            return this.cachedInjectors.get(t);
          }
          ngOnDestroy() {
            try {
              for (const t of this.cachedInjectors.values())
                null !== t && t.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
          static #e = (this.ɵprov = S({
            token: e,
            providedIn: "environment",
            factory: () => new e(M(ft)),
          }));
        }
        return e;
      })();
      function uD(e) {
        e.getStandaloneInjector = (n) =>
          n.get(KR).getOrCreateStandaloneInjector(e);
      }
      function Si(e, n) {
        const t = e[n];
        return t === V ? void 0 : t;
      }
      function yD(e, n, t, r, o, i, s) {
        const a = n + t;
        return (function tr(e, n, t, r) {
          const o = je(e, n, t);
          return je(e, n + 1, r) || o;
        })(e, a, o, i)
          ? Yt(e, a + 2, s ? r.call(s, o, i) : r(o, i))
          : Si(e, a + 2);
      }
      function Ai(e, n) {
        const t = q();
        let r;
        const o = e + U;
        t.firstCreatePass
          ? ((r = (function yx(e, n) {
              if (n)
                for (let t = n.length - 1; t >= 0; t--) {
                  const r = n[t];
                  if (e === r.name) return r;
                }
            })(n, t.pipeRegistry)),
            (t.data[o] = r),
            r.onDestroy && (t.destroyHooks ??= []).push(o, r.onDestroy))
          : (r = t.data[o]);
        const i = r.factory || (r.factory = Yn(r.type)),
          a = Ke(C);
        try {
          const u = Os(!1),
            c = i();
          return (
            Os(u),
            (function YT(e, n, t, r) {
              t >= e.data.length &&
                ((e.data[t] = null), (e.blueprint[t] = null)),
                (n[t] = r);
            })(t, v(), o, c),
            c
          );
        } finally {
          Ke(a);
        }
      }
      function Oa(e, n, t) {
        const r = e + U,
          o = v(),
          i = Ir(o, r);
        return Ti(o, r)
          ? (function mD(e, n, t, r, o, i) {
              const s = n + t;
              return je(e, s, o)
                ? Yt(e, s + 1, i ? r.call(i, o) : r(o))
                : Si(e, s + 1);
            })(o, qe(), n, i.transform, t, i)
          : i.transform(t);
      }
      function Ti(e, n) {
        return e[w].data[n].pure;
      }
      function Cx() {
        return this._results[Symbol.iterator]();
      }
      class gd {
        static #e = Symbol.iterator;
        get changes() {
          return this._changes || (this._changes = new de());
        }
        constructor(n = !1) {
          (this._emitDistinctChangesOnly = n),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const t = gd.prototype;
          t[Symbol.iterator] || (t[Symbol.iterator] = Cx);
        }
        get(n) {
          return this._results[n];
        }
        map(n) {
          return this._results.map(n);
        }
        filter(n) {
          return this._results.filter(n);
        }
        find(n) {
          return this._results.find(n);
        }
        reduce(n, t) {
          return this._results.reduce(n, t);
        }
        forEach(n) {
          this._results.forEach(n);
        }
        some(n) {
          return this._results.some(n);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(n, t) {
          const r = this;
          r.dirty = !1;
          const o = (function wt(e) {
            return e.flat(Number.POSITIVE_INFINITY);
          })(n);
          (this._changesDetected = !(function uS(e, n, t) {
            if (e.length !== n.length) return !1;
            for (let r = 0; r < e.length; r++) {
              let o = e[r],
                i = n[r];
              if ((t && ((o = t(o)), (i = t(i))), i !== o)) return !1;
            }
            return !0;
          })(r._results, o, t)) &&
            ((r._results = o),
            (r.length = o.length),
            (r.last = o[this.length - 1]),
            (r.first = o[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      function Ex(e, n, t, r = !0) {
        const o = n[w];
        if (
          ((function XS(e, n, t, r) {
            const o = Re + r,
              i = t.length;
            r > 0 && (t[o - 1][xt] = n),
              r < i - Re
                ? ((n[xt] = t[o]), dg(t, Re + r, n))
                : (t.push(n), (n[xt] = null)),
              (n[le] = t);
            const s = n[jo];
            null !== s &&
              t !== s &&
              (function JS(e, n) {
                const t = e[Er];
                n[ve] !== n[le][le][ve] && (e[dp] = !0),
                  null === t ? (e[Er] = [n]) : t.push(n);
              })(s, n);
            const a = n[Ut];
            null !== a && a.insertView(e), (n[j] |= 128);
          })(o, n, e, t),
          r)
        ) {
          const i = Kc(t, e),
            s = n[L],
            a = Xs(s, e[zt]);
          null !== a &&
            (function ZS(e, n, t, r, o, i) {
              (r[pe] = o), (r[Le] = n), ni(e, r, t, 1, o, i);
            })(o, e[Le], s, n, a, i);
        }
      }
      let mn = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = Mx);
        }
        return e;
      })();
      const bx = mn,
        Ix = class extends bx {
          constructor(n, t, r) {
            super(),
              (this._declarationLView = n),
              (this._declarationTContainer = t),
              (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(n, t) {
            return this.createEmbeddedViewImpl(n, t);
          }
          createEmbeddedViewImpl(n, t, r) {
            const o = (function wx(e, n, t, r) {
              const o = n.tView,
                a = ga(
                  e,
                  o,
                  t,
                  4096 & e[j] ? 4096 : 16,
                  null,
                  n,
                  null,
                  null,
                  null,
                  r?.injector ?? null,
                  r?.hydrationInfo ?? null
                );
              a[jo] = e[n.index];
              const c = e[Ut];
              return (
                null !== c && (a[Ut] = c.createEmbeddedView(o)), zl(o, a, t), a
              );
            })(this._declarationLView, this._declarationTContainer, n, {
              injector: t,
              hydrationInfo: r,
            });
            return new hi(o);
          }
        };
      function Mx() {
        return Pa(Oe(), v());
      }
      function Pa(e, n) {
        return 4 & e.type ? new Ix(n, e, qr(e, n)) : null;
      }
      let Lt = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = xx);
        }
        return e;
      })();
      function xx() {
        return AD(Oe(), v());
      }
      const Ox = Lt,
        MD = class extends Ox {
          constructor(n, t, r) {
            super(),
              (this._lContainer = n),
              (this._hostTNode = t),
              (this._hostLView = r);
          }
          get element() {
            return qr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Ze(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const n = Fs(this._hostTNode, this._hostLView);
            if (xc(n)) {
              const t = Zo(n, this._hostLView),
                r = Wo(n);
              return new Ze(t[w].data[r + 8], t);
            }
            return new Ze(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(n) {
            const t = SD(this._lContainer);
            return (null !== t && t[n]) || null;
          }
          get length() {
            return this._lContainer.length - Re;
          }
          createEmbeddedView(n, t, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const a = n.createEmbeddedViewImpl(t || {}, i, null);
            return this.insertImpl(a, o, false), a;
          }
          createComponent(n, t, r, o, i) {
            const s =
              n &&
              !(function Qo(e) {
                return "function" == typeof e;
              })(n);
            let a;
            if (s) a = t;
            else {
              const g = t || {};
              (a = g.index),
                (r = g.injector),
                (o = g.projectableNodes),
                (i = g.environmentInjector || g.ngModuleRef);
            }
            const u = s ? n : new pi(G(n)),
              c = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const y = (s ? c : this.parentInjector).get(ft, null);
              y && (i = y);
            }
            G(u.componentType ?? {});
            const h = u.create(c, o, null, i);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(n, t) {
            return this.insertImpl(n, t, !1);
          }
          insertImpl(n, t, r) {
            const o = n._lView;
            if (
              (function _M(e) {
                return Ge(e[le]);
              })(o)
            ) {
              const u = this.indexOf(n);
              if (-1 !== u) this.detach(u);
              else {
                const c = o[le],
                  l = new MD(c, c[Le], c[le]);
                l.detach(l.indexOf(n));
              }
            }
            const s = this._adjustIndex(t),
              a = this._lContainer;
            return (
              Ex(a, o, s, !r), n.attachToViewContainerRef(), dg(md(a), s, n), n
            );
          }
          move(n, t) {
            return this.insert(n, t);
          }
          indexOf(n) {
            const t = SD(this._lContainer);
            return null !== t ? t.indexOf(n) : -1;
          }
          remove(n) {
            const t = this._adjustIndex(n, -1),
              r = Qs(this._lContainer, t);
            r && (Vs(md(this._lContainer), t), Yc(r[w], r));
          }
          detach(n) {
            const t = this._adjustIndex(n, -1),
              r = Qs(this._lContainer, t);
            return r && null != Vs(md(this._lContainer), t) ? new hi(r) : null;
          }
          _adjustIndex(n, t = 0) {
            return n ?? this.length + t;
          }
        };
      function SD(e) {
        return e[8];
      }
      function md(e) {
        return e[8] || (e[8] = []);
      }
      function AD(e, n) {
        let t;
        const r = n[e.index];
        return (
          Ge(r)
            ? (t = r)
            : ((t = ny(r, n, null, e)), (n[e.index] = t), ma(n, t)),
          TD(t, n, e, r),
          new MD(t, e, n)
        );
      }
      let TD = function ND(e, n, t, r) {
        if (e[zt]) return;
        let o;
        (o =
          8 & t.type
            ? se(r)
            : (function Px(e, n) {
                const t = e[L],
                  r = t.createComment(""),
                  o = nt(n, e);
                return (
                  Jn(
                    t,
                    Xs(t, o),
                    r,
                    (function n0(e, n) {
                      return e.nextSibling(n);
                    })(t, o),
                    !1
                  ),
                  r
                );
              })(n, t)),
          (e[zt] = o);
      };
      class yd {
        constructor(n) {
          (this.queryList = n), (this.matches = null);
        }
        clone() {
          return new yd(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class vd {
        constructor(n = []) {
          this.queries = n;
        }
        createEmbeddedView(n) {
          const t = n.queries;
          if (null !== t) {
            const r =
                null !== n.contentQueries ? n.contentQueries[0] : t.length,
              o = [];
            for (let i = 0; i < r; i++) {
              const s = t.getByIndex(i);
              o.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new vd(o);
          }
          return null;
        }
        insertView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        detachView(n) {
          this.dirtyQueriesWithMatches(n);
        }
        dirtyQueriesWithMatches(n) {
          for (let t = 0; t < this.queries.length; t++)
            null !== VD(n, t).matches && this.queries[t].setDirty();
        }
      }
      class RD {
        constructor(n, t, r = null) {
          (this.predicate = n), (this.flags = t), (this.read = r);
        }
      }
      class Dd {
        constructor(n = []) {
          this.queries = n;
        }
        elementStart(n, t) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(n, t);
        }
        elementEnd(n) {
          for (let t = 0; t < this.queries.length; t++)
            this.queries[t].elementEnd(n);
        }
        embeddedTView(n) {
          let t = null;
          for (let r = 0; r < this.length; r++) {
            const o = null !== t ? t.length : 0,
              i = this.getByIndex(r).embeddedTView(n, o);
            i &&
              ((i.indexInDeclarationView = r),
              null !== t ? t.push(i) : (t = [i]));
          }
          return null !== t ? new Dd(t) : null;
        }
        template(n, t) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(n, t);
        }
        getByIndex(n) {
          return this.queries[n];
        }
        get length() {
          return this.queries.length;
        }
        track(n) {
          this.queries.push(n);
        }
      }
      class _d {
        constructor(n, t = -1) {
          (this.metadata = n),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = t);
        }
        elementStart(n, t) {
          this.isApplyingToNode(t) && this.matchTNode(n, t);
        }
        elementEnd(n) {
          this._declarationNodeIndex === n.index &&
            (this._appliesToNextNode = !1);
        }
        template(n, t) {
          this.elementStart(n, t);
        }
        embeddedTView(n, t) {
          return this.isApplyingToNode(n)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-n.index, t),
              new _d(this.metadata))
            : null;
        }
        isApplyingToNode(n) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const t = this._declarationNodeIndex;
            let r = n.parent;
            for (; null !== r && 8 & r.type && r.index !== t; ) r = r.parent;
            return t === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(n, t) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let o = 0; o < r.length; o++) {
              const i = r[o];
              this.matchTNodeWithReadOption(n, t, Lx(t, i)),
                this.matchTNodeWithReadOption(n, t, ks(t, n, i, !1, !1));
            }
          else
            r === mn
              ? 4 & t.type && this.matchTNodeWithReadOption(n, t, -1)
              : this.matchTNodeWithReadOption(n, t, ks(t, n, r, !1, !1));
        }
        matchTNodeWithReadOption(n, t, r) {
          if (null !== r) {
            const o = this.metadata.read;
            if (null !== o)
              if (o === ht || o === Lt || (o === mn && 4 & t.type))
                this.addMatch(t.index, -2);
              else {
                const i = ks(t, n, o, !1, !1);
                null !== i && this.addMatch(t.index, i);
              }
            else this.addMatch(t.index, r);
          }
        }
        addMatch(n, t) {
          null === this.matches
            ? (this.matches = [n, t])
            : this.matches.push(n, t);
        }
      }
      function Lx(e, n) {
        const t = e.localNames;
        if (null !== t)
          for (let r = 0; r < t.length; r += 2) if (t[r] === n) return t[r + 1];
        return null;
      }
      function jx(e, n, t, r) {
        return -1 === t
          ? (function Vx(e, n) {
              return 11 & e.type ? qr(e, n) : 4 & e.type ? Pa(e, n) : null;
            })(n, e)
          : -2 === t
          ? (function Bx(e, n, t) {
              return t === ht
                ? qr(n, e)
                : t === mn
                ? Pa(n, e)
                : t === Lt
                ? AD(n, e)
                : void 0;
            })(e, n, r)
          : Xn(e, e[w], t, n);
      }
      function xD(e, n, t, r) {
        const o = n[Ut].queries[r];
        if (null === o.matches) {
          const i = e.data,
            s = t.matches,
            a = [];
          for (let u = 0; u < s.length; u += 2) {
            const c = s[u];
            a.push(c < 0 ? null : jx(n, i[c], s[u + 1], t.metadata.read));
          }
          o.matches = a;
        }
        return o.matches;
      }
      function Cd(e, n, t, r) {
        const o = e.queries.getByIndex(t),
          i = o.matches;
        if (null !== i) {
          const s = xD(e, n, o, t);
          for (let a = 0; a < i.length; a += 2) {
            const u = i[a];
            if (u > 0) r.push(s[a / 2]);
            else {
              const c = i[a + 1],
                l = n[-u];
              for (let d = Re; d < l.length; d++) {
                const f = l[d];
                f[jo] === f[le] && Cd(f[w], f, c, r);
              }
              if (null !== l[Er]) {
                const d = l[Er];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  Cd(h[w], h, c, r);
                }
              }
            }
          }
        }
        return r;
      }
      function OD(e) {
        const n = v(),
          t = q(),
          r = zp();
        Sc(r + 1);
        const o = VD(t, r);
        if (
          e.dirty &&
          (function vM(e) {
            return 4 == (4 & e[j]);
          })(n) ===
            (2 == (2 & o.metadata.flags))
        ) {
          if (null === o.matches) e.reset([]);
          else {
            const i = o.crossesNgTemplate ? Cd(t, n, r, []) : xD(t, n, o, r);
            e.reset(i, rA), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function PD(e, n, t, r) {
        const o = q();
        if (o.firstCreatePass) {
          const i = Oe();
          (function LD(e, n, t) {
            null === e.queries && (e.queries = new Dd()),
              e.queries.track(new _d(n, t));
          })(o, new RD(n, t, r), i.index),
            (function Ux(e, n) {
              const t = e.contentQueries || (e.contentQueries = []);
              n !== (t.length ? t[t.length - 1] : -1) &&
                t.push(e.queries.length - 1, n);
            })(o, e),
            2 == (2 & t) && (o.staticContentQueries = !0);
        }
        !(function kD(e, n, t) {
          const r = new gd(4 == (4 & t));
          (function kA(e, n, t, r) {
            const o = oy(n);
            o.push(t), e.firstCreatePass && iy(e).push(r, o.length - 1);
          })(e, n, r, r.destroy),
            null === n[Ut] && (n[Ut] = new vd()),
            n[Ut].queries.push(new yd(r));
        })(o, v(), t);
      }
      function VD(e, n) {
        return e.queries.getByIndex(n);
      }
      const Sd = new I("Application Initializer");
      let Ad = (() => {
          class e {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((t, r) => {
                  (this.resolve = t), (this.reject = r);
                })),
                (this.appInits = E(Sd, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const t = [];
              for (const o of this.appInits) {
                const i = o();
                if (Di(i)) t.push(i);
                else if (Vy(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  t.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(t)
                .then(() => {
                  r();
                })
                .catch((o) => {
                  this.reject(o);
                }),
                0 === t.length && r(),
                (this.initialized = !0);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        t_ = (() => {
          class e {
            log(t) {
              console.log(t);
            }
            warn(t) {
              console.warn(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })();
      const yn = new I("LocaleId", {
        providedIn: "root",
        factory: () =>
          E(yn, $.Optional | $.SkipSelf) ||
          (function dO() {
            return (typeof $localize < "u" && $localize.locale) || uo;
          })(),
      });
      let La = (() => {
        class e {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new vt(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const t = this.taskId++;
            return this.pendingTasks.add(t), t;
          }
          remove(t) {
            this.pendingTasks.delete(t),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      class pO {
        constructor(n, t) {
          (this.ngModuleFactory = n), (this.componentFactories = t);
        }
      }
      let n_ = (() => {
        class e {
          compileModuleSync(t) {
            return new fd(t);
          }
          compileModuleAsync(t) {
            return Promise.resolve(this.compileModuleSync(t));
          }
          compileModuleAndAllComponentsSync(t) {
            const r = this.compileModuleSync(t),
              i = pn(ct(t).declarations).reduce((s, a) => {
                const u = G(a);
                return u && s.push(new pi(u)), s;
              }, []);
            return new pO(r, i);
          }
          compileModuleAndAllComponentsAsync(t) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(t));
          }
          clearCache() {}
          clearCacheFor(t) {}
          getModuleId(t) {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const s_ = new I(""),
        ja = new I("");
      let Od,
        Rd = (() => {
          class e {
            constructor(t, r, o) {
              (this._ngZone = t),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Od ||
                  ((function kO(e) {
                    Od = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                t.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      ae.assertNotInAngularZone(),
                        queueMicrotask(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                queueMicrotask(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let t = this._callbacks.pop();
                    clearTimeout(t.timeoutId), t.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let t = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(t) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((t) => ({
                    source: t.source,
                    creationLocation: t.creationLocation,
                    data: t.data,
                  }))
                : [];
            }
            addCallback(t, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    t(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: t, timeoutId: i, updateCb: o });
            }
            whenStable(t, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(t, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(t) {
              this.registry.registerApplication(t, this);
            }
            unregisterApplication(t) {
              this.registry.unregisterApplication(t);
            }
            findProviders(t, r, o) {
              return [];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(ae), M(xd), M(ja));
            });
            static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        xd = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(t, r) {
              this._applications.set(t, r);
            }
            unregisterApplication(t) {
              this._applications.delete(t);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(t) {
              return this._applications.get(t) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(t, r = !0) {
              return Od?.findTestabilityInTree(this, t, r) ?? null;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            }));
          }
          return e;
        })(),
        Fn = null;
      const a_ = new I("AllowMultipleToken"),
        Pd = new I("PlatformDestroyListeners"),
        Fd = new I("appBootstrapListener");
      class c_ {
        constructor(n, t) {
          (this.name = n), (this.token = t);
        }
      }
      function d_(e, n, t = []) {
        const r = `Platform: ${n}`,
          o = new I(r);
        return (i = []) => {
          let s = kd();
          if (!s || s.injector.get(a_, !1)) {
            const a = [...t, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function jO(e) {
                  if (Fn && !Fn.get(a_, !1)) throw new D(400, !1);
                  (function u_() {
                    !(function iM(e) {
                      Ep = e;
                    })(() => {
                      throw new D(600, !1);
                    });
                  })(),
                    (Fn = e);
                  const n = e.get(h_);
                  (function l_(e) {
                    e.get(gm, null)?.forEach((t) => t());
                  })(e);
                })(
                  (function f_(e = [], n) {
                    return pt.create({
                      name: n,
                      providers: [
                        { provide: fl, useValue: "platform" },
                        { provide: Pd, useValue: new Set([() => (Fn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function HO(e) {
            const n = kd();
            if (!n) throw new D(401, !1);
            return n;
          })();
        };
      }
      function kd() {
        return Fn?.get(h_) ?? null;
      }
      let h_ = (() => {
        class e {
          constructor(t) {
            (this._injector = t),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(t, r) {
            const o = (function $O(e = "zone.js", n) {
              return "noop" === e ? new vA() : "zone.js" === e ? new ae(n) : e;
            })(
              r?.ngZone,
              (function p_(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              })
            );
            return o.run(() => {
              const i = (function JR(e, n, t) {
                  return new dd(e, n, t);
                })(
                  t.moduleType,
                  this.injector,
                  (function D_(e) {
                    return [
                      { provide: ae, useFactory: e },
                      {
                        provide: si,
                        multi: !0,
                        useFactory: () => {
                          const n = E(zO, { optional: !0 });
                          return () => n.initialize();
                        },
                      },
                      { provide: v_, useFactory: UO },
                      { provide: xm, useFactory: Om },
                    ];
                  })(() => o)
                ),
                s = i.injector.get(hn, null);
              return (
                o.runOutsideAngular(() => {
                  const a = o.onError.subscribe({
                    next: (u) => {
                      s.handleError(u);
                    },
                  });
                  i.onDestroy(() => {
                    Ba(this._modules, i), a.unsubscribe();
                  });
                }),
                (function g_(e, n, t) {
                  try {
                    const r = t();
                    return Di(r)
                      ? r.catch((o) => {
                          throw (
                            (n.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (n.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(s, o, () => {
                  const a = i.injector.get(Ad);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function Fv(e) {
                          Dt(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (Pv = e.toLowerCase().replace(/_/g, "-"));
                        })(i.injector.get(yn, uo) || uo),
                        this._moduleDoBootstrap(i),
                        i
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(t, r = []) {
            const o = m_({}, r);
            return (function LO(e, n, t) {
              const r = new fd(t);
              return Promise.resolve(r);
            })(0, 0, t).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(t) {
            const r = t.injector.get(fo);
            if (t._bootstrapComponents.length > 0)
              t._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!t.instance.ngDoBootstrap) throw new D(-403, !1);
              t.instance.ngDoBootstrap(r);
            }
            this._modules.push(t);
          }
          onDestroy(t) {
            this._destroyListeners.push(t);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new D(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const t = this._injector.get(Pd, null);
            t && (t.forEach((r) => r()), t.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(pt));
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function m_(e, n) {
        return Array.isArray(n) ? n.reduce(m_, e) : { ...e, ...n };
      }
      let fo = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = E(v_)),
              (this.zoneIsStable = E(xm)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = E(La).hasPendingTasks.pipe(
                Tt((t) => (t ? R(!1) : this.zoneIsStable)),
                (function mI(e, n = bn) {
                  return (
                    (e = e ?? yI),
                    Ee((t, r) => {
                      let o,
                        i = !0;
                      t.subscribe(
                        _e(r, (s) => {
                          const a = n(s);
                          (i || !e(o, a)) && ((i = !1), (o = a), r.next(s));
                        })
                      );
                    })
                  );
                })(),
                Hh()
              )),
              (this._injector = E(ft));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(t, r) {
            const o = t instanceof _m;
            if (!this._injector.get(Ad).done)
              throw (
                (!o &&
                  (function vr(e) {
                    const n = G(e) || Ne(e) || ze(e);
                    return null !== n && n.standalone;
                  })(t),
                new D(405, !1))
              );
            let s;
            (s = o ? t : this._injector.get(fa).resolveComponentFactory(t)),
              this.componentTypes.push(s.componentType);
            const a = (function VO(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(or),
              c = s.create(pt.NULL, [], r || s.selector, a),
              l = c.location.nativeElement,
              d = c.injector.get(s_, null);
            return (
              d?.registerApplication(l),
              c.onDestroy(() => {
                this.detachView(c.hostView),
                  Ba(this.components, c),
                  d?.unregisterApplication(l);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new D(101, !1);
            try {
              this._runningTick = !0;
              for (let t of this._views) t.detectChanges();
            } catch (t) {
              this.internalErrorHandler(t);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(t) {
            const r = t;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(t) {
            const r = t;
            Ba(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(t) {
            this.attachView(t.hostView), this.tick(), this.components.push(t);
            const r = this._injector.get(Fd, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(t));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((t) => t()),
                  this._views.slice().forEach((t) => t.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(t) {
            return (
              this._destroyListeners.push(t),
              () => Ba(this._destroyListeners, t)
            );
          }
          destroy() {
            if (this._destroyed) throw new D(406, !1);
            const t = this._injector;
            t.destroy && !t.destroyed && t.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function Ba(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      const v_ = new I("", {
        providedIn: "root",
        factory: () => E(hn).handleError.bind(void 0),
      });
      function UO() {
        const e = E(ae),
          n = E(hn);
        return (t) => e.runOutsideAngular(() => n.handleError(t));
      }
      let zO = (() => {
        class e {
          constructor() {
            (this.zone = E(ae)), (this.applicationRef = E(fo));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      let Ha = (() => {
        class e {
          static #e = (this.__NG_ELEMENT_ID__ = qO);
        }
        return e;
      })();
      function qO(e) {
        return (function WO(e, n, t) {
          if (Zn(e) && !t) {
            const r = lt(e.index, n);
            return new hi(r, r);
          }
          return 47 & e.type ? new hi(n[ve], n) : null;
        })(Oe(), v(), 16 == (16 & e));
      }
      class E_ {
        constructor() {}
        supports(n) {
          return _a(n);
        }
        create(n) {
          return new KO(n);
        }
      }
      const JO = (e, n) => n;
      class KO {
        constructor(n) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = n || JO);
        }
        forEachItem(n) {
          let t;
          for (t = this._itHead; null !== t; t = t._next) n(t);
        }
        forEachOperation(n) {
          let t = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; t || r; ) {
            const s = !r || (t && t.currentIndex < I_(r, o, i)) ? t : r,
              a = I_(s, o, i),
              u = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((t = t._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const c = a - o,
                l = u - o;
              if (c != l) {
                for (let f = 0; f < c; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  l <= p && p < c && (i[f] = h + 1);
                }
                i[s.previousIndex] = l - c;
              }
            }
            a !== u && n(s, a, u);
          }
        }
        forEachPreviousItem(n) {
          let t;
          for (t = this._previousItHead; null !== t; t = t._nextPrevious) n(t);
        }
        forEachAddedItem(n) {
          let t;
          for (t = this._additionsHead; null !== t; t = t._nextAdded) n(t);
        }
        forEachMovedItem(n) {
          let t;
          for (t = this._movesHead; null !== t; t = t._nextMoved) n(t);
        }
        forEachRemovedItem(n) {
          let t;
          for (t = this._removalsHead; null !== t; t = t._nextRemoved) n(t);
        }
        forEachIdentityChange(n) {
          let t;
          for (
            t = this._identityChangesHead;
            null !== t;
            t = t._nextIdentityChange
          )
            n(t);
        }
        diff(n) {
          if ((null == n && (n = []), !_a(n))) throw new D(900, !1);
          return this.check(n) ? this : null;
        }
        onDestroy() {}
        check(n) {
          this._reset();
          let o,
            i,
            s,
            t = this._itHead,
            r = !1;
          if (Array.isArray(n)) {
            this.length = n.length;
            for (let a = 0; a < this.length; a++)
              (i = n[a]),
                (s = this._trackByFn(a, i)),
                null !== t && Object.is(t.trackById, s)
                  ? (r && (t = this._verifyReinsertion(t, i, s, a)),
                    Object.is(t.item, i) || this._addIdentityChange(t, i))
                  : ((t = this._mismatch(t, i, s, a)), (r = !0)),
                (t = t._next);
          } else
            (o = 0),
              (function AT(e, n) {
                if (Array.isArray(e))
                  for (let t = 0; t < e.length; t++) n(e[t]);
                else {
                  const t = e[Symbol.iterator]();
                  let r;
                  for (; !(r = t.next()).done; ) n(r.value);
                }
              })(n, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== t && Object.is(t.trackById, s)
                    ? (r && (t = this._verifyReinsertion(t, a, s, o)),
                      Object.is(t.item, a) || this._addIdentityChange(t, a))
                    : ((t = this._mismatch(t, a, s, o)), (r = !0)),
                  (t = t._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(t), (this.collection = n), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let n;
            for (
              n = this._previousItHead = this._itHead;
              null !== n;
              n = n._next
            )
              n._nextPrevious = n._next;
            for (n = this._additionsHead; null !== n; n = n._nextAdded)
              n.previousIndex = n.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                n = this._movesHead;
              null !== n;
              n = n._nextMoved
            )
              n.previousIndex = n.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(n, t, r, o) {
          let i;
          return (
            null === n ? (i = this._itTail) : ((i = n._prev), this._remove(n)),
            null !==
            (n =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                this._reinsertAfter(n, i, o))
              : null !==
                (n =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(n.item, t) || this._addIdentityChange(n, t),
                this._moveAfter(n, i, o))
              : (n = this._addAfter(new eP(t, r), i, o)),
            n
          );
        }
        _verifyReinsertion(n, t, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (n = this._reinsertAfter(i, n._prev, o))
              : n.currentIndex != o &&
                ((n.currentIndex = o), this._addToMoves(n, o)),
            n
          );
        }
        _truncate(n) {
          for (; null !== n; ) {
            const t = n._next;
            this._addToRemovals(this._unlink(n)), (n = t);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(n, t, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
          const o = n._prevRemoved,
            i = n._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(n, t, r),
            this._addToMoves(n, r),
            n
          );
        }
        _moveAfter(n, t, r) {
          return (
            this._unlink(n),
            this._insertAfter(n, t, r),
            this._addToMoves(n, r),
            n
          );
        }
        _addAfter(n, t, r) {
          return (
            this._insertAfter(n, t, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = n)
                : (this._additionsTail._nextAdded = n)),
            n
          );
        }
        _insertAfter(n, t, r) {
          const o = null === t ? this._itHead : t._next;
          return (
            (n._next = o),
            (n._prev = t),
            null === o ? (this._itTail = n) : (o._prev = n),
            null === t ? (this._itHead = n) : (t._next = n),
            null === this._linkedRecords && (this._linkedRecords = new b_()),
            this._linkedRecords.put(n),
            (n.currentIndex = r),
            n
          );
        }
        _remove(n) {
          return this._addToRemovals(this._unlink(n));
        }
        _unlink(n) {
          null !== this._linkedRecords && this._linkedRecords.remove(n);
          const t = n._prev,
            r = n._next;
          return (
            null === t ? (this._itHead = r) : (t._next = r),
            null === r ? (this._itTail = t) : (r._prev = t),
            n
          );
        }
        _addToMoves(n, t) {
          return (
            n.previousIndex === t ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = n)
                  : (this._movesTail._nextMoved = n)),
            n
          );
        }
        _addToRemovals(n) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new b_()),
            this._unlinkedRecords.put(n),
            (n.currentIndex = null),
            (n._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = n),
                (n._prevRemoved = null))
              : ((n._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = n)),
            n
          );
        }
        _addIdentityChange(n, t) {
          return (
            (n.item = t),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = n)
                : (this._identityChangesTail._nextIdentityChange = n)),
            n
          );
        }
      }
      class eP {
        constructor(n, t) {
          (this.item = n),
            (this.trackById = t),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class tP {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(n) {
          null === this._head
            ? ((this._head = this._tail = n),
              (n._nextDup = null),
              (n._prevDup = null))
            : ((this._tail._nextDup = n),
              (n._prevDup = this._tail),
              (n._nextDup = null),
              (this._tail = n));
        }
        get(n, t) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === t || t <= r.currentIndex) &&
              Object.is(r.trackById, n)
            )
              return r;
          return null;
        }
        remove(n) {
          const t = n._prevDup,
            r = n._nextDup;
          return (
            null === t ? (this._head = r) : (t._nextDup = r),
            null === r ? (this._tail = t) : (r._prevDup = t),
            null === this._head
          );
        }
      }
      class b_ {
        constructor() {
          this.map = new Map();
        }
        put(n) {
          const t = n.trackById;
          let r = this.map.get(t);
          r || ((r = new tP()), this.map.set(t, r)), r.add(n);
        }
        get(n, t) {
          const o = this.map.get(n);
          return o ? o.get(n, t) : null;
        }
        remove(n) {
          const t = n.trackById;
          return this.map.get(t).remove(n) && this.map.delete(t), n;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function I_(e, n, t) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return t && r < t.length && (o = t[r]), r + n + o;
      }
      function S_() {
        return new za([new E_()]);
      }
      let za = (() => {
        class e {
          static #e = (this.ɵprov = S({
            token: e,
            providedIn: "root",
            factory: S_,
          }));
          constructor(t) {
            this.factories = t;
          }
          static create(t, r) {
            if (null != r) {
              const o = r.factories.slice();
              t = t.concat(o);
            }
            return new e(t);
          }
          static extend(t) {
            return {
              provide: e,
              useFactory: (r) => e.create(t, r || S_()),
              deps: [[e, new Hs(), new Bs()]],
            };
          }
          find(t) {
            const r = this.factories.find((o) => o.supports(t));
            if (null != r) return r;
            throw new D(901, !1);
          }
        }
        return e;
      })();
      const sP = d_(null, "core", []);
      let aP = (() => {
        class e {
          constructor(t) {}
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(fo));
          });
          static #t = (this.ɵmod = et({ type: e }));
          static #n = (this.ɵinj = $e({}));
        }
        return e;
      })();
      function ho(e) {
        return "boolean" == typeof e ? e : null != e && "false" !== e;
      }
      let $d = null;
      function kn() {
        return $d;
      }
      class CP {}
      const mt = new I("DocumentToken");
      let Ud = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: function () {
              return E(EP);
            },
            providedIn: "platform",
          }));
        }
        return e;
      })();
      const wP = new I("Location Initialized");
      let EP = (() => {
        class e extends Ud {
          constructor() {
            super(),
              (this._doc = E(mt)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return kn().getBaseHref(this._doc);
          }
          onPopState(t) {
            const r = kn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", t, !1),
              () => r.removeEventListener("popstate", t)
            );
          }
          onHashChange(t) {
            const r = kn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", t, !1),
              () => r.removeEventListener("hashchange", t)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(t) {
            this._location.pathname = t;
          }
          pushState(t, r, o) {
            this._history.pushState(t, r, o);
          }
          replaceState(t, r, o) {
            this._history.replaceState(t, r, o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(t = 0) {
            this._history.go(t);
          }
          getState() {
            return this._history.state;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: function () {
              return new e();
            },
            providedIn: "platform",
          }));
        }
        return e;
      })();
      function zd(e, n) {
        if (0 == e.length) return n;
        if (0 == n.length) return e;
        let t = 0;
        return (
          e.endsWith("/") && t++,
          n.startsWith("/") && t++,
          2 == t ? e + n.substring(1) : 1 == t ? e + n : e + "/" + n
        );
      }
      function L_(e) {
        const n = e.match(/#|\?|$/),
          t = (n && n.index) || e.length;
        return e.slice(0, t - ("/" === e[t - 1] ? 1 : 0)) + e.slice(t);
      }
      function vn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let sr = (() => {
        class e {
          historyGo(t) {
            throw new Error("Not implemented");
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: function () {
              return E(j_);
            },
            providedIn: "root",
          }));
        }
        return e;
      })();
      const V_ = new I("appBaseHref");
      let j_ = (() => {
          class e extends sr {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  E(mt).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(t) {
              return zd(this._baseHref, t);
            }
            path(t = !1) {
              const r =
                  this._platformLocation.pathname +
                  vn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && t ? `${r}${o}` : r;
            }
            pushState(t, r, o, i) {
              const s = this.prepareExternalUrl(o + vn(i));
              this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, o, i) {
              const s = this.prepareExternalUrl(o + vn(i));
              this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(Ud), M(V_, 8));
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        bP = (() => {
          class e extends sr {
            constructor(t, r) {
              super(),
                (this._platformLocation = t),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(t) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(t),
                this._platformLocation.onHashChange(t)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(t = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(t) {
              const r = zd(this._baseHref, t);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(t, r, o, i) {
              let s = this.prepareExternalUrl(o + vn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(t, r, s);
            }
            replaceState(t, r, o, i) {
              let s = this.prepareExternalUrl(o + vn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(t, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(t = 0) {
              this._platformLocation.historyGo?.(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(Ud), M(V_, 8));
            });
            static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
          }
          return e;
        })(),
        Gd = (() => {
          class e {
            constructor(t) {
              (this._subject = new de()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = t);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function SP(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, t] = e.split(/\/\/[^\/]+/);
                  return t;
                }
                return e;
              })(L_(B_(r)))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(t = !1) {
              return this.normalize(this._locationStrategy.path(t));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(t, r = "") {
              return this.path() == this.normalize(t + vn(r));
            }
            normalize(t) {
              return e.stripTrailingSlash(
                (function MP(e, n) {
                  if (!e || !n.startsWith(e)) return n;
                  const t = n.substring(e.length);
                  return "" === t || ["/", ";", "?", "#"].includes(t[0])
                    ? t
                    : n;
                })(this._basePath, B_(t))
              );
            }
            prepareExternalUrl(t) {
              return (
                t && "/" !== t[0] && (t = "/" + t),
                this._locationStrategy.prepareExternalUrl(t)
              );
            }
            go(t, r = "", o = null) {
              this._locationStrategy.pushState(o, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + vn(r)),
                  o
                );
            }
            replaceState(t, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", t, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(t + vn(r)),
                  o
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(t = 0) {
              this._locationStrategy.historyGo?.(t);
            }
            onUrlChange(t) {
              return (
                this._urlChangeListeners.push(t),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(t);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(t = "", r) {
              this._urlChangeListeners.forEach((o) => o(t, r));
            }
            subscribe(t, r, o) {
              return this._subject.subscribe({
                next: t,
                error: r,
                complete: o,
              });
            }
            static #e = (this.normalizeQueryParams = vn);
            static #t = (this.joinWithSlash = zd);
            static #n = (this.stripTrailingSlash = L_);
            static #r = (this.ɵfac = function (r) {
              return new (r || e)(M(sr));
            });
            static #o = (this.ɵprov = S({
              token: e,
              factory: function () {
                return (function IP() {
                  return new Gd(M(sr));
                })();
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      function B_(e) {
        return e.replace(/\/index.html$/, "");
      }
      var Xe = (function (e) {
          return (
            (e[(e.Format = 0)] = "Format"),
            (e[(e.Standalone = 1)] = "Standalone"),
            e
          );
        })(Xe || {}),
        re = (function (e) {
          return (
            (e[(e.Narrow = 0)] = "Narrow"),
            (e[(e.Abbreviated = 1)] = "Abbreviated"),
            (e[(e.Wide = 2)] = "Wide"),
            (e[(e.Short = 3)] = "Short"),
            e
          );
        })(re || {}),
        yt = (function (e) {
          return (
            (e[(e.Short = 0)] = "Short"),
            (e[(e.Medium = 1)] = "Medium"),
            (e[(e.Long = 2)] = "Long"),
            (e[(e.Full = 3)] = "Full"),
            e
          );
        })(yt || {}),
        De = (function (e) {
          return (
            (e[(e.Decimal = 0)] = "Decimal"),
            (e[(e.Group = 1)] = "Group"),
            (e[(e.List = 2)] = "List"),
            (e[(e.PercentSign = 3)] = "PercentSign"),
            (e[(e.PlusSign = 4)] = "PlusSign"),
            (e[(e.MinusSign = 5)] = "MinusSign"),
            (e[(e.Exponential = 6)] = "Exponential"),
            (e[(e.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
            (e[(e.PerMille = 8)] = "PerMille"),
            (e[(e.Infinity = 9)] = "Infinity"),
            (e[(e.NaN = 10)] = "NaN"),
            (e[(e.TimeSeparator = 11)] = "TimeSeparator"),
            (e[(e.CurrencyDecimal = 12)] = "CurrencyDecimal"),
            (e[(e.CurrencyGroup = 13)] = "CurrencyGroup"),
            e
          );
        })(De || {});
      function Wa(e, n) {
        return Mt(Ye(e)[ue.DateFormat], n);
      }
      function Za(e, n) {
        return Mt(Ye(e)[ue.TimeFormat], n);
      }
      function Ya(e, n) {
        return Mt(Ye(e)[ue.DateTimeFormat], n);
      }
      function It(e, n) {
        const t = Ye(e),
          r = t[ue.NumberSymbols][n];
        if (typeof r > "u") {
          if (n === De.CurrencyDecimal) return t[ue.NumberSymbols][De.Decimal];
          if (n === De.CurrencyGroup) return t[ue.NumberSymbols][De.Group];
        }
        return r;
      }
      function $_(e) {
        if (!e[ue.ExtraData])
          throw new Error(
            `Missing extra locale data for the locale "${
              e[ue.LocaleId]
            }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
          );
      }
      function Mt(e, n) {
        for (let t = n; t > -1; t--) if (typeof e[t] < "u") return e[t];
        throw new Error("Locale data API: locale data undefined");
      }
      function Wd(e) {
        const [n, t] = e.split(":");
        return { hours: +n, minutes: +t };
      }
      const HP =
          /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
        Oi = {},
        $P =
          /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
      var Dn = (function (e) {
          return (
            (e[(e.Short = 0)] = "Short"),
            (e[(e.ShortGMT = 1)] = "ShortGMT"),
            (e[(e.Long = 2)] = "Long"),
            (e[(e.Extended = 3)] = "Extended"),
            e
          );
        })(Dn || {}),
        Y = (function (e) {
          return (
            (e[(e.FullYear = 0)] = "FullYear"),
            (e[(e.Month = 1)] = "Month"),
            (e[(e.Date = 2)] = "Date"),
            (e[(e.Hours = 3)] = "Hours"),
            (e[(e.Minutes = 4)] = "Minutes"),
            (e[(e.Seconds = 5)] = "Seconds"),
            (e[(e.FractionalSeconds = 6)] = "FractionalSeconds"),
            (e[(e.Day = 7)] = "Day"),
            e
          );
        })(Y || {}),
        Q = (function (e) {
          return (
            (e[(e.DayPeriods = 0)] = "DayPeriods"),
            (e[(e.Days = 1)] = "Days"),
            (e[(e.Months = 2)] = "Months"),
            (e[(e.Eras = 3)] = "Eras"),
            e
          );
        })(Q || {});
      function UP(e, n, t, r) {
        let o = (function JP(e) {
          if (G_(e)) return e;
          if ("number" == typeof e && !isNaN(e)) return new Date(e);
          if ("string" == typeof e) {
            if (((e = e.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(e))) {
              const [o, i = 1, s = 1] = e.split("-").map((a) => +a);
              return Qa(o, i - 1, s);
            }
            const t = parseFloat(e);
            if (!isNaN(e - t)) return new Date(t);
            let r;
            if ((r = e.match(HP)))
              return (function KP(e) {
                const n = new Date(0);
                let t = 0,
                  r = 0;
                const o = e[8] ? n.setUTCFullYear : n.setFullYear,
                  i = e[8] ? n.setUTCHours : n.setHours;
                e[9] &&
                  ((t = Number(e[9] + e[10])), (r = Number(e[9] + e[11]))),
                  o.call(n, Number(e[1]), Number(e[2]) - 1, Number(e[3]));
                const s = Number(e[4] || 0) - t,
                  a = Number(e[5] || 0) - r,
                  u = Number(e[6] || 0),
                  c = Math.floor(1e3 * parseFloat("0." + (e[7] || 0)));
                return i.call(n, s, a, u, c), n;
              })(r);
          }
          const n = new Date(e);
          if (!G_(n)) throw new Error(`Unable to convert "${e}" into a date`);
          return n;
        })(e);
        n = _n(t, n) || n;
        let a,
          s = [];
        for (; n; ) {
          if (((a = $P.exec(n)), !a)) {
            s.push(n);
            break;
          }
          {
            s = s.concat(a.slice(1));
            const l = s.pop();
            if (!l) break;
            n = l;
          }
        }
        let u = o.getTimezoneOffset();
        r &&
          ((u = z_(r, u)),
          (o = (function XP(e, n, t) {
            const r = t ? -1 : 1,
              o = e.getTimezoneOffset();
            return (function QP(e, n) {
              return (
                (e = new Date(e.getTime())).setMinutes(e.getMinutes() + n), e
              );
            })(e, r * (z_(n, o) - o));
          })(o, r, !0)));
        let c = "";
        return (
          s.forEach((l) => {
            const d = (function YP(e) {
              if (Yd[e]) return Yd[e];
              let n;
              switch (e) {
                case "G":
                case "GG":
                case "GGG":
                  n = ce(Q.Eras, re.Abbreviated);
                  break;
                case "GGGG":
                  n = ce(Q.Eras, re.Wide);
                  break;
                case "GGGGG":
                  n = ce(Q.Eras, re.Narrow);
                  break;
                case "y":
                  n = we(Y.FullYear, 1, 0, !1, !0);
                  break;
                case "yy":
                  n = we(Y.FullYear, 2, 0, !0, !0);
                  break;
                case "yyy":
                  n = we(Y.FullYear, 3, 0, !1, !0);
                  break;
                case "yyyy":
                  n = we(Y.FullYear, 4, 0, !1, !0);
                  break;
                case "Y":
                  n = eu(1);
                  break;
                case "YY":
                  n = eu(2, !0);
                  break;
                case "YYY":
                  n = eu(3);
                  break;
                case "YYYY":
                  n = eu(4);
                  break;
                case "M":
                case "L":
                  n = we(Y.Month, 1, 1);
                  break;
                case "MM":
                case "LL":
                  n = we(Y.Month, 2, 1);
                  break;
                case "MMM":
                  n = ce(Q.Months, re.Abbreviated);
                  break;
                case "MMMM":
                  n = ce(Q.Months, re.Wide);
                  break;
                case "MMMMM":
                  n = ce(Q.Months, re.Narrow);
                  break;
                case "LLL":
                  n = ce(Q.Months, re.Abbreviated, Xe.Standalone);
                  break;
                case "LLLL":
                  n = ce(Q.Months, re.Wide, Xe.Standalone);
                  break;
                case "LLLLL":
                  n = ce(Q.Months, re.Narrow, Xe.Standalone);
                  break;
                case "w":
                  n = Zd(1);
                  break;
                case "ww":
                  n = Zd(2);
                  break;
                case "W":
                  n = Zd(1, !0);
                  break;
                case "d":
                  n = we(Y.Date, 1);
                  break;
                case "dd":
                  n = we(Y.Date, 2);
                  break;
                case "c":
                case "cc":
                  n = we(Y.Day, 1);
                  break;
                case "ccc":
                  n = ce(Q.Days, re.Abbreviated, Xe.Standalone);
                  break;
                case "cccc":
                  n = ce(Q.Days, re.Wide, Xe.Standalone);
                  break;
                case "ccccc":
                  n = ce(Q.Days, re.Narrow, Xe.Standalone);
                  break;
                case "cccccc":
                  n = ce(Q.Days, re.Short, Xe.Standalone);
                  break;
                case "E":
                case "EE":
                case "EEE":
                  n = ce(Q.Days, re.Abbreviated);
                  break;
                case "EEEE":
                  n = ce(Q.Days, re.Wide);
                  break;
                case "EEEEE":
                  n = ce(Q.Days, re.Narrow);
                  break;
                case "EEEEEE":
                  n = ce(Q.Days, re.Short);
                  break;
                case "a":
                case "aa":
                case "aaa":
                  n = ce(Q.DayPeriods, re.Abbreviated);
                  break;
                case "aaaa":
                  n = ce(Q.DayPeriods, re.Wide);
                  break;
                case "aaaaa":
                  n = ce(Q.DayPeriods, re.Narrow);
                  break;
                case "b":
                case "bb":
                case "bbb":
                  n = ce(Q.DayPeriods, re.Abbreviated, Xe.Standalone, !0);
                  break;
                case "bbbb":
                  n = ce(Q.DayPeriods, re.Wide, Xe.Standalone, !0);
                  break;
                case "bbbbb":
                  n = ce(Q.DayPeriods, re.Narrow, Xe.Standalone, !0);
                  break;
                case "B":
                case "BB":
                case "BBB":
                  n = ce(Q.DayPeriods, re.Abbreviated, Xe.Format, !0);
                  break;
                case "BBBB":
                  n = ce(Q.DayPeriods, re.Wide, Xe.Format, !0);
                  break;
                case "BBBBB":
                  n = ce(Q.DayPeriods, re.Narrow, Xe.Format, !0);
                  break;
                case "h":
                  n = we(Y.Hours, 1, -12);
                  break;
                case "hh":
                  n = we(Y.Hours, 2, -12);
                  break;
                case "H":
                  n = we(Y.Hours, 1);
                  break;
                case "HH":
                  n = we(Y.Hours, 2);
                  break;
                case "m":
                  n = we(Y.Minutes, 1);
                  break;
                case "mm":
                  n = we(Y.Minutes, 2);
                  break;
                case "s":
                  n = we(Y.Seconds, 1);
                  break;
                case "ss":
                  n = we(Y.Seconds, 2);
                  break;
                case "S":
                  n = we(Y.FractionalSeconds, 1);
                  break;
                case "SS":
                  n = we(Y.FractionalSeconds, 2);
                  break;
                case "SSS":
                  n = we(Y.FractionalSeconds, 3);
                  break;
                case "Z":
                case "ZZ":
                case "ZZZ":
                  n = Ja(Dn.Short);
                  break;
                case "ZZZZZ":
                  n = Ja(Dn.Extended);
                  break;
                case "O":
                case "OO":
                case "OOO":
                case "z":
                case "zz":
                case "zzz":
                  n = Ja(Dn.ShortGMT);
                  break;
                case "OOOO":
                case "ZZZZ":
                case "zzzz":
                  n = Ja(Dn.Long);
                  break;
                default:
                  return null;
              }
              return (Yd[e] = n), n;
            })(l);
            c += d
              ? d(o, t, u)
              : "''" === l
              ? "'"
              : l.replace(/(^'|'$)/g, "").replace(/''/g, "'");
          }),
          c
        );
      }
      function Qa(e, n, t) {
        const r = new Date(0);
        return r.setFullYear(e, n, t), r.setHours(0, 0, 0), r;
      }
      function _n(e, n) {
        const t = (function TP(e) {
          return Ye(e)[ue.LocaleId];
        })(e);
        if (((Oi[t] = Oi[t] || {}), Oi[t][n])) return Oi[t][n];
        let r = "";
        switch (n) {
          case "shortDate":
            r = Wa(e, yt.Short);
            break;
          case "mediumDate":
            r = Wa(e, yt.Medium);
            break;
          case "longDate":
            r = Wa(e, yt.Long);
            break;
          case "fullDate":
            r = Wa(e, yt.Full);
            break;
          case "shortTime":
            r = Za(e, yt.Short);
            break;
          case "mediumTime":
            r = Za(e, yt.Medium);
            break;
          case "longTime":
            r = Za(e, yt.Long);
            break;
          case "fullTime":
            r = Za(e, yt.Full);
            break;
          case "short":
            const o = _n(e, "shortTime"),
              i = _n(e, "shortDate");
            r = Xa(Ya(e, yt.Short), [o, i]);
            break;
          case "medium":
            const s = _n(e, "mediumTime"),
              a = _n(e, "mediumDate");
            r = Xa(Ya(e, yt.Medium), [s, a]);
            break;
          case "long":
            const u = _n(e, "longTime"),
              c = _n(e, "longDate");
            r = Xa(Ya(e, yt.Long), [u, c]);
            break;
          case "full":
            const l = _n(e, "fullTime"),
              d = _n(e, "fullDate");
            r = Xa(Ya(e, yt.Full), [l, d]);
        }
        return r && (Oi[t][n] = r), r;
      }
      function Xa(e, n) {
        return (
          n &&
            (e = e.replace(/\{([^}]+)}/g, function (t, r) {
              return null != n && r in n ? n[r] : t;
            })),
          e
        );
      }
      function Vt(e, n, t = "-", r, o) {
        let i = "";
        (e < 0 || (o && e <= 0)) && (o ? (e = 1 - e) : ((e = -e), (i = t)));
        let s = String(e);
        for (; s.length < n; ) s = "0" + s;
        return r && (s = s.slice(s.length - n)), i + s;
      }
      function we(e, n, t = 0, r = !1, o = !1) {
        return function (i, s) {
          let a = (function GP(e, n) {
            switch (e) {
              case Y.FullYear:
                return n.getFullYear();
              case Y.Month:
                return n.getMonth();
              case Y.Date:
                return n.getDate();
              case Y.Hours:
                return n.getHours();
              case Y.Minutes:
                return n.getMinutes();
              case Y.Seconds:
                return n.getSeconds();
              case Y.FractionalSeconds:
                return n.getMilliseconds();
              case Y.Day:
                return n.getDay();
              default:
                throw new Error(`Unknown DateType value "${e}".`);
            }
          })(e, i);
          if (((t > 0 || a > -t) && (a += t), e === Y.Hours))
            0 === a && -12 === t && (a = 12);
          else if (e === Y.FractionalSeconds)
            return (function zP(e, n) {
              return Vt(e, 3).substring(0, n);
            })(a, n);
          const u = It(s, De.MinusSign);
          return Vt(a, n, u, r, o);
        };
      }
      function ce(e, n, t = Xe.Format, r = !1) {
        return function (o, i) {
          return (function qP(e, n, t, r, o, i) {
            switch (t) {
              case Q.Months:
                return (function xP(e, n, t) {
                  const r = Ye(e),
                    i = Mt([r[ue.MonthsFormat], r[ue.MonthsStandalone]], n);
                  return Mt(i, t);
                })(n, o, r)[e.getMonth()];
              case Q.Days:
                return (function RP(e, n, t) {
                  const r = Ye(e),
                    i = Mt([r[ue.DaysFormat], r[ue.DaysStandalone]], n);
                  return Mt(i, t);
                })(n, o, r)[e.getDay()];
              case Q.DayPeriods:
                const s = e.getHours(),
                  a = e.getMinutes();
                if (i) {
                  const c = (function kP(e) {
                      const n = Ye(e);
                      return (
                        $_(n),
                        (n[ue.ExtraData][2] || []).map((r) =>
                          "string" == typeof r ? Wd(r) : [Wd(r[0]), Wd(r[1])]
                        )
                      );
                    })(n),
                    l = (function LP(e, n, t) {
                      const r = Ye(e);
                      $_(r);
                      const i =
                        Mt([r[ue.ExtraData][0], r[ue.ExtraData][1]], n) || [];
                      return Mt(i, t) || [];
                    })(n, o, r),
                    d = c.findIndex((f) => {
                      if (Array.isArray(f)) {
                        const [h, p] = f,
                          g = s >= h.hours && a >= h.minutes,
                          y = s < p.hours || (s === p.hours && a < p.minutes);
                        if (h.hours < p.hours) {
                          if (g && y) return !0;
                        } else if (g || y) return !0;
                      } else if (f.hours === s && f.minutes === a) return !0;
                      return !1;
                    });
                  if (-1 !== d) return l[d];
                }
                return (function NP(e, n, t) {
                  const r = Ye(e),
                    i = Mt(
                      [r[ue.DayPeriodsFormat], r[ue.DayPeriodsStandalone]],
                      n
                    );
                  return Mt(i, t);
                })(n, o, r)[s < 12 ? 0 : 1];
              case Q.Eras:
                return (function OP(e, n) {
                  return Mt(Ye(e)[ue.Eras], n);
                })(n, r)[e.getFullYear() <= 0 ? 0 : 1];
              default:
                throw new Error(`unexpected translation type ${t}`);
            }
          })(o, i, e, n, t, r);
        };
      }
      function Ja(e) {
        return function (n, t, r) {
          const o = -1 * r,
            i = It(t, De.MinusSign),
            s = o > 0 ? Math.floor(o / 60) : Math.ceil(o / 60);
          switch (e) {
            case Dn.Short:
              return (
                (o >= 0 ? "+" : "") + Vt(s, 2, i) + Vt(Math.abs(o % 60), 2, i)
              );
            case Dn.ShortGMT:
              return "GMT" + (o >= 0 ? "+" : "") + Vt(s, 1, i);
            case Dn.Long:
              return (
                "GMT" +
                (o >= 0 ? "+" : "") +
                Vt(s, 2, i) +
                ":" +
                Vt(Math.abs(o % 60), 2, i)
              );
            case Dn.Extended:
              return 0 === r
                ? "Z"
                : (o >= 0 ? "+" : "") +
                    Vt(s, 2, i) +
                    ":" +
                    Vt(Math.abs(o % 60), 2, i);
            default:
              throw new Error(`Unknown zone width "${e}"`);
          }
        };
      }
      const WP = 0,
        Ka = 4;
      function U_(e) {
        return Qa(
          e.getFullYear(),
          e.getMonth(),
          e.getDate() + (Ka - e.getDay())
        );
      }
      function Zd(e, n = !1) {
        return function (t, r) {
          let o;
          if (n) {
            const i = new Date(t.getFullYear(), t.getMonth(), 1).getDay() - 1,
              s = t.getDate();
            o = 1 + Math.floor((s + i) / 7);
          } else {
            const i = U_(t),
              s = (function ZP(e) {
                const n = Qa(e, WP, 1).getDay();
                return Qa(e, 0, 1 + (n <= Ka ? Ka : Ka + 7) - n);
              })(i.getFullYear()),
              a = i.getTime() - s.getTime();
            o = 1 + Math.round(a / 6048e5);
          }
          return Vt(o, e, It(r, De.MinusSign));
        };
      }
      function eu(e, n = !1) {
        return function (t, r) {
          return Vt(U_(t).getFullYear(), e, It(r, De.MinusSign), n);
        };
      }
      const Yd = {};
      function z_(e, n) {
        e = e.replace(/:/g, "");
        const t = Date.parse("Jan 01, 1970 00:00:00 " + e) / 6e4;
        return isNaN(t) ? n : t;
      }
      function G_(e) {
        return e instanceof Date && !isNaN(e.valueOf());
      }
      function Y_(e, n) {
        n = encodeURIComponent(n);
        for (const t of e.split(";")) {
          const r = t.indexOf("="),
            [o, i] = -1 == r ? [t, ""] : [t.slice(0, r), t.slice(r + 1)];
          if (o.trim() === n) return decodeURIComponent(i);
        }
        return null;
      }
      class h1 {
        constructor(n, t, r, o) {
          (this.$implicit = n),
            (this.ngForOf = t),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let J_ = (() => {
        class e {
          set ngForOf(t) {
            (this._ngForOf = t), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(t) {
            this._trackByFn = t;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(t, r, o) {
            (this._viewContainer = t),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(t) {
            t && (this._template = t);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const t = this._ngForOf;
              !this._differ &&
                t &&
                (this._differ = this._differs
                  .find(t)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const t = this._differ.diff(this._ngForOf);
              t && this._applyChanges(t);
            }
          }
          _applyChanges(t) {
            const r = this._viewContainer;
            t.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new h1(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), K_(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            t.forEachIdentityChange((o) => {
              K_(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(C(Lt), C(mn), C(za));
          });
          static #t = (this.ɵdir = F({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      function K_(e, n) {
        e.context.$implicit = n.item;
      }
      let eC = (() => {
        class e {
          constructor(t, r) {
            (this._viewContainer = t),
              (this._context = new p1()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(t) {
            (this._context.$implicit = this._context.ngIf = t),
              this._updateView();
          }
          set ngIfThen(t) {
            tC("ngIfThen", t),
              (this._thenTemplateRef = t),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(t) {
            tC("ngIfElse", t),
              (this._elseTemplateRef = t),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(t, r) {
            return !0;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(C(Lt), C(mn));
          });
          static #t = (this.ɵdir = F({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          }));
        }
        return e;
      })();
      class p1 {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function tC(e, n) {
        if (n && !n.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${Ie(n)}'.`
          );
      }
      const S1 = new I("DATE_PIPE_DEFAULT_TIMEZONE"),
        A1 = new I("DATE_PIPE_DEFAULT_OPTIONS");
      let rC = (() => {
          class e {
            constructor(t, r, o) {
              (this.locale = t),
                (this.defaultTimezone = r),
                (this.defaultOptions = o);
            }
            transform(t, r, o, i) {
              if (null == t || "" === t || t != t) return null;
              try {
                return UP(
                  t,
                  r ?? this.defaultOptions?.dateFormat ?? "mediumDate",
                  i || this.locale,
                  o ??
                    this.defaultOptions?.timezone ??
                    this.defaultTimezone ??
                    void 0
                );
              } catch (s) {
                throw (function jt(e, n) {
                  return new D(2100, !1);
                })();
              }
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(C(yn, 16), C(S1, 24), C(A1, 24));
            });
            static #t = (this.ɵpipe = ke({
              name: "date",
              type: e,
              pure: !0,
              standalone: !0,
            }));
          }
          return e;
        })(),
        uf = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({}));
          }
          return e;
        })();
      function sC(e) {
        return "server" === e;
      }
      let H1 = (() => {
        class e {
          static #e = (this.ɵprov = S({
            token: e,
            providedIn: "root",
            factory: () => new $1(M(mt), window),
          }));
        }
        return e;
      })();
      class $1 {
        constructor(n, t) {
          (this.document = n), (this.window = t), (this.offset = () => [0, 0]);
        }
        setOffset(n) {
          this.offset = Array.isArray(n) ? () => n : n;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(n) {
          this.supportsScrolling() && this.window.scrollTo(n[0], n[1]);
        }
        scrollToAnchor(n) {
          if (!this.supportsScrolling()) return;
          const t = (function U1(e, n) {
            const t = e.getElementById(n) || e.getElementsByName(n)[0];
            if (t) return t;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              "function" == typeof e.body.attachShadow
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(n) || i.querySelector(`[name="${n}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, n);
          t && (this.scrollToElement(t), t.focus());
        }
        setHistoryScrollRestoration(n) {
          this.supportsScrolling() &&
            (this.window.history.scrollRestoration = n);
        }
        scrollToElement(n) {
          const t = n.getBoundingClientRect(),
            r = t.left + this.window.pageXOffset,
            o = t.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      class aC {}
      class fF extends CP {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class df extends fF {
        static makeCurrent() {
          !(function _P(e) {
            $d || ($d = e);
          })(new df());
        }
        onAndCancel(n, t, r) {
          return (
            n.addEventListener(t, r),
            () => {
              n.removeEventListener(t, r);
            }
          );
        }
        dispatchEvent(n, t) {
          n.dispatchEvent(t);
        }
        remove(n) {
          n.parentNode && n.parentNode.removeChild(n);
        }
        createElement(n, t) {
          return (t = t || this.getDefaultDocument()).createElement(n);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(n) {
          return n.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(n) {
          return n instanceof DocumentFragment;
        }
        getGlobalEventTarget(n, t) {
          return "window" === t
            ? window
            : "document" === t
            ? n
            : "body" === t
            ? n.body
            : null;
        }
        getBaseHref(n) {
          const t = (function hF() {
            return (
              (ki = ki || document.querySelector("base")),
              ki ? ki.getAttribute("href") : null
            );
          })();
          return null == t
            ? null
            : (function pF(e) {
                (ou = ou || document.createElement("a")),
                  ou.setAttribute("href", e);
                const n = ou.pathname;
                return "/" === n.charAt(0) ? n : `/${n}`;
              })(t);
        }
        resetBaseElement() {
          ki = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(n) {
          return Y_(document.cookie, n);
        }
      }
      let ou,
        ki = null,
        mF = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
          }
          return e;
        })();
      const ff = new I("EventManagerPlugins");
      let fC = (() => {
        class e {
          constructor(t, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              t.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = t.slice().reverse());
          }
          addEventListener(t, r, o) {
            return this._findPluginFor(r).addEventListener(t, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(t) {
            let r = this._eventNameToPlugin.get(t);
            if (r) return r;
            if (((r = this._plugins.find((i) => i.supports(t))), !r))
              throw new D(5101, !1);
            return this._eventNameToPlugin.set(t, r), r;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(ff), M(ae));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class hC {
        constructor(n) {
          this._doc = n;
        }
      }
      const hf = "ng-app-id";
      let pC = (() => {
        class e {
          constructor(t, r, o, i = {}) {
            (this.doc = t),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = sC(i)),
              this.resetHostNodes();
          }
          addStyles(t) {
            for (const r of t)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(t) {
            for (const r of t)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const t = this.styleNodesInDOM;
            t && (t.forEach((r) => r.remove()), t.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(t) {
            this.hostNodes.add(t);
            for (const r of this.getAllStyles()) this.addStyleToHost(t, r);
          }
          removeHost(t) {
            this.hostNodes.delete(t);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(t) {
            for (const r of this.hostNodes) this.addStyleToHost(r, t);
          }
          onStyleRemoved(t) {
            const r = this.styleRef;
            r.get(t)?.elements?.forEach((o) => o.remove()), r.delete(t);
          }
          collectServerRenderedStyles() {
            const t = this.doc.head?.querySelectorAll(
              `style[${hf}="${this.appId}"]`
            );
            if (t?.length) {
              const r = new Map();
              return (
                t.forEach((o) => {
                  null != o.textContent && r.set(o.textContent, o);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(t, r) {
            const o = this.styleRef;
            if (o.has(t)) {
              const i = o.get(t);
              return (i.usage += r), i.usage;
            }
            return o.set(t, { usage: r, elements: [] }), r;
          }
          getStyleElement(t, r) {
            const o = this.styleNodesInDOM,
              i = o?.get(r);
            if (i?.parentNode === t)
              return o.delete(r), i.removeAttribute(hf), i;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(hf, this.appId),
                s
              );
            }
          }
          addStyleToHost(t, r) {
            const o = this.getStyleElement(t, r);
            t.appendChild(o);
            const i = this.styleRef,
              s = i.get(r)?.elements;
            s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
          }
          resetHostNodes() {
            const t = this.hostNodes;
            t.clear(), t.add(this.doc.head);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(mt), M(sa), M(mm, 8), M(er));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const pf = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        gf = /%COMP%/g,
        _F = new I("RemoveStylesOnCompDestroy", {
          providedIn: "root",
          factory: () => !1,
        });
      function mC(e, n) {
        return n.map((t) => t.replace(gf, e));
      }
      let yC = (() => {
        class e {
          constructor(t, r, o, i, s, a, u, c = null) {
            (this.eventManager = t),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestroy = i),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = u),
              (this.nonce = c),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = sC(a)),
              (this.defaultRenderer = new mf(t, s, u, this.platformIsServer));
          }
          createRenderer(t, r) {
            if (!t || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === Nt.ShadowDom &&
              (r = { ...r, encapsulation: Nt.Emulated });
            const o = this.getOrCreateRenderer(t, r);
            return (
              o instanceof DC
                ? o.applyToHost(t)
                : o instanceof yf && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(t, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.doc,
                a = this.ngZone,
                u = this.eventManager,
                c = this.sharedStylesHost,
                l = this.removeStylesOnCompDestroy,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case Nt.Emulated:
                  i = new DC(u, c, r, this.appId, l, s, a, d);
                  break;
                case Nt.ShadowDom:
                  return new bF(u, c, t, r, s, a, this.nonce, d);
                default:
                  i = new yf(u, c, r, l, s, a, d);
              }
              o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(
              M(fC),
              M(pC),
              M(sa),
              M(_F),
              M(mt),
              M(er),
              M(ae),
              M(mm)
            );
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      class mf {
        constructor(n, t, r, o) {
          (this.eventManager = n),
            (this.doc = t),
            (this.ngZone = r),
            (this.platformIsServer = o),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(n, t) {
          return t
            ? this.doc.createElementNS(pf[t] || t, n)
            : this.doc.createElement(n);
        }
        createComment(n) {
          return this.doc.createComment(n);
        }
        createText(n) {
          return this.doc.createTextNode(n);
        }
        appendChild(n, t) {
          (vC(n) ? n.content : n).appendChild(t);
        }
        insertBefore(n, t, r) {
          n && (vC(n) ? n.content : n).insertBefore(t, r);
        }
        removeChild(n, t) {
          n && n.removeChild(t);
        }
        selectRootElement(n, t) {
          let r = "string" == typeof n ? this.doc.querySelector(n) : n;
          if (!r) throw new D(-5104, !1);
          return t || (r.textContent = ""), r;
        }
        parentNode(n) {
          return n.parentNode;
        }
        nextSibling(n) {
          return n.nextSibling;
        }
        setAttribute(n, t, r, o) {
          if (o) {
            t = o + ":" + t;
            const i = pf[o];
            i ? n.setAttributeNS(i, t, r) : n.setAttribute(t, r);
          } else n.setAttribute(t, r);
        }
        removeAttribute(n, t, r) {
          if (r) {
            const o = pf[r];
            o ? n.removeAttributeNS(o, t) : n.removeAttribute(`${r}:${t}`);
          } else n.removeAttribute(t);
        }
        addClass(n, t) {
          n.classList.add(t);
        }
        removeClass(n, t) {
          n.classList.remove(t);
        }
        setStyle(n, t, r, o) {
          o & (xn.DashCase | xn.Important)
            ? n.style.setProperty(t, r, o & xn.Important ? "important" : "")
            : (n.style[t] = r);
        }
        removeStyle(n, t, r) {
          r & xn.DashCase ? n.style.removeProperty(t) : (n.style[t] = "");
        }
        setProperty(n, t, r) {
          n[t] = r;
        }
        setValue(n, t) {
          n.nodeValue = t;
        }
        listen(n, t, r) {
          if (
            "string" == typeof n &&
            !(n = kn().getGlobalEventTarget(this.doc, n))
          )
            throw new Error(`Unsupported event target ${n} for event ${t}`);
          return this.eventManager.addEventListener(
            n,
            t,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(n) {
          return (t) => {
            if ("__ngUnwrap__" === t) return n;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => n(t))
                : n(t)) && t.preventDefault();
          };
        }
      }
      function vC(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class bF extends mf {
        constructor(n, t, r, o, i, s, a, u) {
          super(n, i, s, u),
            (this.sharedStylesHost = t),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const c = mC(o.id, o.styles);
          for (const l of c) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = l),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(n) {
          return n === this.hostEl ? this.shadowRoot : n;
        }
        appendChild(n, t) {
          return super.appendChild(this.nodeOrShadowRoot(n), t);
        }
        insertBefore(n, t, r) {
          return super.insertBefore(this.nodeOrShadowRoot(n), t, r);
        }
        removeChild(n, t) {
          return super.removeChild(this.nodeOrShadowRoot(n), t);
        }
        parentNode(n) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(n))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class yf extends mf {
        constructor(n, t, r, o, i, s, a, u) {
          super(n, i, s, a),
            (this.sharedStylesHost = t),
            (this.removeStylesOnCompDestroy = o),
            (this.styles = u ? mC(u, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }
      class DC extends yf {
        constructor(n, t, r, o, i, s, a, u) {
          const c = o + "-" + r.id;
          super(n, t, r, i, s, a, u, c),
            (this.contentAttr = (function CF(e) {
              return "_ngcontent-%COMP%".replace(gf, e);
            })(c)),
            (this.hostAttr = (function wF(e) {
              return "_nghost-%COMP%".replace(gf, e);
            })(c));
        }
        applyToHost(n) {
          this.applyStyles(), this.setAttribute(n, this.hostAttr, "");
        }
        createElement(n, t) {
          const r = super.createElement(n, t);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let IF = (() => {
        class e extends hC {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return !0;
          }
          addEventListener(t, r, o) {
            return (
              t.addEventListener(r, o, !1),
              () => this.removeEventListener(t, r, o)
            );
          }
          removeEventListener(t, r, o) {
            return t.removeEventListener(r, o);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(mt));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const _C = ["alt", "control", "meta", "shift"],
        MF = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        SF = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let AF = (() => {
        class e extends hC {
          constructor(t) {
            super(t);
          }
          supports(t) {
            return null != e.parseEventName(t);
          }
          addEventListener(t, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => kn().onAndCancel(t, i.domEventName, s));
          }
          static parseEventName(t) {
            const r = t.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              _C.forEach((c) => {
                const l = r.indexOf(c);
                l > -1 && (r.splice(l, 1), (s += c + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(t, r) {
            let o = MF[t.key] || t.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = t.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                _C.forEach((s) => {
                  s !== o && (0, SF[s])(t) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(t, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, t) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(t) {
            return "esc" === t ? "escape" : t;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(mt));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const xF = d_(sP, "browser", [
          { provide: er, useValue: "browser" },
          {
            provide: gm,
            useValue: function TF() {
              df.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: mt,
            useFactory: function RF() {
              return (
                (function d0(e) {
                  nl = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        OF = new I(""),
        EC = [
          {
            provide: ja,
            useClass: class gF {
              addToWindow(n) {
                (ie.getAngularTestability = (r, o = !0) => {
                  const i = n.findTestabilityInTree(r, o);
                  if (null == i) throw new D(5103, !1);
                  return i;
                }),
                  (ie.getAllAngularTestabilities = () =>
                    n.getAllTestabilities()),
                  (ie.getAllAngularRootElements = () => n.getAllRootElements()),
                  ie.frameworkStabilizers || (ie.frameworkStabilizers = []),
                  ie.frameworkStabilizers.push((r) => {
                    const o = ie.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach((u) => {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(n, t, r) {
                return null == t
                  ? null
                  : n.getTestability(t) ??
                      (r
                        ? kn().isShadowRoot(t)
                          ? this.findTestabilityInTree(n, t.host, !0)
                          : this.findTestabilityInTree(n, t.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: s_, useClass: Rd, deps: [ae, xd, ja] },
          { provide: Rd, useClass: Rd, deps: [ae, xd, ja] },
        ],
        bC = [
          { provide: fl, useValue: "root" },
          {
            provide: hn,
            useFactory: function NF() {
              return new hn();
            },
            deps: [],
          },
          { provide: ff, useClass: IF, multi: !0, deps: [mt, ae, er] },
          { provide: ff, useClass: AF, multi: !0, deps: [mt] },
          yC,
          pC,
          fC,
          { provide: wm, useExisting: yC },
          { provide: aC, useClass: mF, deps: [] },
          [],
        ];
      let PF = (() => {
          class e {
            constructor(t) {}
            static withServerTransition(t) {
              return {
                ngModule: e,
                providers: [{ provide: sa, useValue: t.appId }],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(OF, 12));
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({
              providers: [...bC, ...EC],
              imports: [uf, aP],
            }));
          }
          return e;
        })(),
        IC = (() => {
          class e {
            constructor(t) {
              this._doc = t;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(t) {
              this._doc.title = t || "";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(mt));
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: function (r) {
                let o = null;
                return (
                  (o = r
                    ? new r()
                    : (function kF() {
                        return new IC(M(mt));
                      })()),
                  o
                );
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      function go(e, n) {
        return ne(n) ? Te(e, n, 1) : Te(e, 1);
      }
      function Cn(e, n) {
        return Ee((t, r) => {
          let o = 0;
          t.subscribe(_e(r, (i) => e.call(n, i, o++) && r.next(i)));
        });
      }
      function Li(e) {
        return Ee((n, t) => {
          try {
            n.subscribe(t);
          } finally {
            t.add(e);
          }
        });
      }
      typeof window < "u" && window;
      class iu {}
      class su {}
      class Kt {
        constructor(n) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            n
              ? "string" == typeof n
                ? (this.lazyInit = () => {
                    (this.headers = new Map()),
                      n.split("\n").forEach((t) => {
                        const r = t.indexOf(":");
                        if (r > 0) {
                          const o = t.slice(0, r),
                            i = o.toLowerCase(),
                            s = t.slice(r + 1).trim();
                          this.maybeSetNormalizedName(o, i),
                            this.headers.has(i)
                              ? this.headers.get(i).push(s)
                              : this.headers.set(i, [s]);
                        }
                      });
                  })
                : typeof Headers < "u" && n instanceof Headers
                ? ((this.headers = new Map()),
                  n.forEach((t, r) => {
                    this.setHeaderEntries(r, t);
                  }))
                : (this.lazyInit = () => {
                    (this.headers = new Map()),
                      Object.entries(n).forEach(([t, r]) => {
                        this.setHeaderEntries(t, r);
                      });
                  })
              : (this.headers = new Map());
        }
        has(n) {
          return this.init(), this.headers.has(n.toLowerCase());
        }
        get(n) {
          this.init();
          const t = this.headers.get(n.toLowerCase());
          return t && t.length > 0 ? t[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(n) {
          return this.init(), this.headers.get(n.toLowerCase()) || null;
        }
        append(n, t) {
          return this.clone({ name: n, value: t, op: "a" });
        }
        set(n, t) {
          return this.clone({ name: n, value: t, op: "s" });
        }
        delete(n, t) {
          return this.clone({ name: n, value: t, op: "d" });
        }
        maybeSetNormalizedName(n, t) {
          this.normalizedNames.has(t) || this.normalizedNames.set(t, n);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Kt
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((n) => this.applyUpdate(n)),
              (this.lazyUpdate = null)));
        }
        copyFrom(n) {
          n.init(),
            Array.from(n.headers.keys()).forEach((t) => {
              this.headers.set(t, n.headers.get(t)),
                this.normalizedNames.set(t, n.normalizedNames.get(t));
            });
        }
        clone(n) {
          const t = new Kt();
          return (
            (t.lazyInit =
              this.lazyInit && this.lazyInit instanceof Kt
                ? this.lazyInit
                : this),
            (t.lazyUpdate = (this.lazyUpdate || []).concat([n])),
            t
          );
        }
        applyUpdate(n) {
          const t = n.name.toLowerCase();
          switch (n.op) {
            case "a":
            case "s":
              let r = n.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(n.name, t);
              const o = ("a" === n.op ? this.headers.get(t) : void 0) || [];
              o.push(...r), this.headers.set(t, o);
              break;
            case "d":
              const i = n.value;
              if (i) {
                let s = this.headers.get(t);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(t), this.normalizedNames.delete(t))
                    : this.headers.set(t, s);
              } else this.headers.delete(t), this.normalizedNames.delete(t);
          }
        }
        setHeaderEntries(n, t) {
          const r = (Array.isArray(t) ? t : [t]).map((i) => i.toString()),
            o = n.toLowerCase();
          this.headers.set(o, r), this.maybeSetNormalizedName(n, o);
        }
        forEach(n) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((t) =>
              n(this.normalizedNames.get(t), this.headers.get(t))
            );
        }
      }
      class HF {
        encodeKey(n) {
          return TC(n);
        }
        encodeValue(n) {
          return TC(n);
        }
        decodeKey(n) {
          return decodeURIComponent(n);
        }
        decodeValue(n) {
          return decodeURIComponent(n);
        }
      }
      const UF = /%(\d[a-f0-9])/gi,
        zF = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function TC(e) {
        return encodeURIComponent(e).replace(UF, (n, t) => zF[t] ?? n);
      }
      function au(e) {
        return `${e}`;
      }
      class Vn {
        constructor(n = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = n.encoder || new HF()),
            n.fromString)
          ) {
            if (n.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function $F(e, n) {
              const t = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [n.decodeKey(o), ""]
                            : [
                                n.decodeKey(o.slice(0, i)),
                                n.decodeValue(o.slice(i + 1)),
                              ],
                        u = t.get(s) || [];
                      u.push(a), t.set(s, u);
                    }),
                t
              );
            })(n.fromString, this.encoder);
          } else
            n.fromObject
              ? ((this.map = new Map()),
                Object.keys(n.fromObject).forEach((t) => {
                  const r = n.fromObject[t],
                    o = Array.isArray(r) ? r.map(au) : [au(r)];
                  this.map.set(t, o);
                }))
              : (this.map = null);
        }
        has(n) {
          return this.init(), this.map.has(n);
        }
        get(n) {
          this.init();
          const t = this.map.get(n);
          return t ? t[0] : null;
        }
        getAll(n) {
          return this.init(), this.map.get(n) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(n, t) {
          return this.clone({ param: n, value: t, op: "a" });
        }
        appendAll(n) {
          const t = [];
          return (
            Object.keys(n).forEach((r) => {
              const o = n[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    t.push({ param: r, value: i, op: "a" });
                  })
                : t.push({ param: r, value: o, op: "a" });
            }),
            this.clone(t)
          );
        }
        set(n, t) {
          return this.clone({ param: n, value: t, op: "s" });
        }
        delete(n, t) {
          return this.clone({ param: n, value: t, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((n) => {
                const t = this.encoder.encodeKey(n);
                return this.map
                  .get(n)
                  .map((r) => t + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((n) => "" !== n)
              .join("&")
          );
        }
        clone(n) {
          const t = new Vn({ encoder: this.encoder });
          return (
            (t.cloneFrom = this.cloneFrom || this),
            (t.updates = (this.updates || []).concat(n)),
            t
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((n) => this.map.set(n, this.cloneFrom.map.get(n))),
              this.updates.forEach((n) => {
                switch (n.op) {
                  case "a":
                  case "s":
                    const t =
                      ("a" === n.op ? this.map.get(n.param) : void 0) || [];
                    t.push(au(n.value)), this.map.set(n.param, t);
                    break;
                  case "d":
                    if (void 0 === n.value) {
                      this.map.delete(n.param);
                      break;
                    }
                    {
                      let r = this.map.get(n.param) || [];
                      const o = r.indexOf(au(n.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(n.param, r)
                          : this.map.delete(n.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class GF {
        constructor() {
          this.map = new Map();
        }
        set(n, t) {
          return this.map.set(n, t), this;
        }
        get(n) {
          return (
            this.map.has(n) || this.map.set(n, n.defaultValue()),
            this.map.get(n)
          );
        }
        delete(n) {
          return this.map.delete(n), this;
        }
        has(n) {
          return this.map.has(n);
        }
        keys() {
          return this.map.keys();
        }
      }
      function NC(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function RC(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function xC(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class Vi {
        constructor(n, t, r, o) {
          let i;
          if (
            ((this.url = t),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = n.toUpperCase()),
            (function qF(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new Kt()),
            this.context || (this.context = new GF()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = t;
            else {
              const a = t.indexOf("?");
              this.urlWithParams =
                t + (-1 === a ? "?" : a < t.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new Vn()), (this.urlWithParams = t);
        }
        serializeBody() {
          return null === this.body
            ? null
            : NC(this.body) ||
              RC(this.body) ||
              xC(this.body) ||
              (function WF(e) {
                return (
                  typeof URLSearchParams < "u" && e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Vn
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || xC(this.body)
            ? null
            : RC(this.body)
            ? this.body.type || null
            : NC(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Vn
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(n = {}) {
          const t = n.method || this.method,
            r = n.url || this.url,
            o = n.responseType || this.responseType,
            i = void 0 !== n.body ? n.body : this.body,
            s =
              void 0 !== n.withCredentials
                ? n.withCredentials
                : this.withCredentials,
            a =
              void 0 !== n.reportProgress
                ? n.reportProgress
                : this.reportProgress;
          let u = n.headers || this.headers,
            c = n.params || this.params;
          const l = n.context ?? this.context;
          return (
            void 0 !== n.setHeaders &&
              (u = Object.keys(n.setHeaders).reduce(
                (d, f) => d.set(f, n.setHeaders[f]),
                u
              )),
            n.setParams &&
              (c = Object.keys(n.setParams).reduce(
                (d, f) => d.set(f, n.setParams[f]),
                c
              )),
            new Vi(t, r, i, {
              params: c,
              headers: u,
              context: l,
              reportProgress: a,
              responseType: o,
              withCredentials: s,
            })
          );
        }
      }
      var mo = (function (e) {
        return (
          (e[(e.Sent = 0)] = "Sent"),
          (e[(e.UploadProgress = 1)] = "UploadProgress"),
          (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
          (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
          (e[(e.Response = 4)] = "Response"),
          (e[(e.User = 5)] = "User"),
          e
        );
      })(mo || {});
      class Df {
        constructor(n, t = 200, r = "OK") {
          (this.headers = n.headers || new Kt()),
            (this.status = void 0 !== n.status ? n.status : t),
            (this.statusText = n.statusText || r),
            (this.url = n.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class _f extends Df {
        constructor(n = {}) {
          super(n), (this.type = mo.ResponseHeader);
        }
        clone(n = {}) {
          return new _f({
            headers: n.headers || this.headers,
            status: void 0 !== n.status ? n.status : this.status,
            statusText: n.statusText || this.statusText,
            url: n.url || this.url || void 0,
          });
        }
      }
      class yo extends Df {
        constructor(n = {}) {
          super(n),
            (this.type = mo.Response),
            (this.body = void 0 !== n.body ? n.body : null);
        }
        clone(n = {}) {
          return new yo({
            body: void 0 !== n.body ? n.body : this.body,
            headers: n.headers || this.headers,
            status: void 0 !== n.status ? n.status : this.status,
            statusText: n.statusText || this.statusText,
            url: n.url || this.url || void 0,
          });
        }
      }
      class OC extends Df {
        constructor(n) {
          super(n, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${n.url || "(unknown url)"}`
                : `Http failure response for ${n.url || "(unknown url)"}: ${
                    n.status
                  } ${n.statusText}`),
            (this.error = n.error || null);
        }
      }
      function Cf(e, n) {
        return {
          body: n,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let PC = (() => {
        class e {
          constructor(t) {
            this.handler = t;
          }
          request(t, r, o = {}) {
            let i;
            if (t instanceof Vi) i = t;
            else {
              let u, c;
              (u = o.headers instanceof Kt ? o.headers : new Kt(o.headers)),
                o.params &&
                  (c =
                    o.params instanceof Vn
                      ? o.params
                      : new Vn({ fromObject: o.params })),
                (i = new Vi(t, r, void 0 !== o.body ? o.body : null, {
                  headers: u,
                  context: o.context,
                  params: c,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = R(i).pipe(go((u) => this.handler.handle(u)));
            if (t instanceof Vi || "events" === o.observe) return s;
            const a = s.pipe(Cn((u) => u instanceof yo));
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      Z((u) => {
                        if (null !== u.body && !(u.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return u.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      Z((u) => {
                        if (null !== u.body && !(u.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return u.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      Z((u) => {
                        if (null !== u.body && "string" != typeof u.body)
                          throw new Error("Response is not a string.");
                        return u.body;
                      })
                    );
                  default:
                    return a.pipe(Z((u) => u.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`
                );
            }
          }
          delete(t, r = {}) {
            return this.request("DELETE", t, r);
          }
          get(t, r = {}) {
            return this.request("GET", t, r);
          }
          head(t, r = {}) {
            return this.request("HEAD", t, r);
          }
          jsonp(t, r) {
            return this.request("JSONP", t, {
              params: new Vn().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(t, r = {}) {
            return this.request("OPTIONS", t, r);
          }
          patch(t, r, o = {}) {
            return this.request("PATCH", t, Cf(o, r));
          }
          post(t, r, o = {}) {
            return this.request("POST", t, Cf(o, r));
          }
          put(t, r, o = {}) {
            return this.request("PUT", t, Cf(o, r));
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(iu));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function LC(e, n) {
        return n(e);
      }
      function YF(e, n) {
        return (t, r) => n.intercept(t, { handle: (o) => e(o, r) });
      }
      const XF = new I(""),
        ji = new I(""),
        VC = new I("");
      function JF() {
        let e = null;
        return (n, t) => {
          null === e &&
            (e = (E(XF, { optional: !0 }) ?? []).reduceRight(YF, LC));
          const r = E(La),
            o = r.add();
          return e(n, t).pipe(Li(() => r.remove(o)));
        };
      }
      let jC = (() => {
        class e extends iu {
          constructor(t, r) {
            super(),
              (this.backend = t),
              (this.injector = r),
              (this.chain = null),
              (this.pendingTasks = E(La));
          }
          handle(t) {
            if (null === this.chain) {
              const o = Array.from(
                new Set([
                  ...this.injector.get(ji),
                  ...this.injector.get(VC, []),
                ])
              );
              this.chain = o.reduceRight(
                (i, s) =>
                  (function QF(e, n, t) {
                    return (r, o) => t.runInContext(() => n(r, (i) => e(i, o)));
                  })(i, s, this.injector),
                LC
              );
            }
            const r = this.pendingTasks.add();
            return this.chain(t, (o) => this.backend.handle(o)).pipe(
              Li(() => this.pendingTasks.remove(r))
            );
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(su), M(ft));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const nk = /^\)\]\}',?\n/;
      let HC = (() => {
        class e {
          constructor(t) {
            this.xhrFactory = t;
          }
          handle(t) {
            if ("JSONP" === t.method) throw new D(-2800, !1);
            const r = this.xhrFactory;
            return (r.ɵloadImpl ? be(r.ɵloadImpl()) : R(null)).pipe(
              Tt(
                () =>
                  new me((i) => {
                    const s = r.build();
                    if (
                      (s.open(t.method, t.urlWithParams),
                      t.withCredentials && (s.withCredentials = !0),
                      t.headers.forEach((g, y) =>
                        s.setRequestHeader(g, y.join(","))
                      ),
                      t.headers.has("Accept") ||
                        s.setRequestHeader(
                          "Accept",
                          "application/json, text/plain, */*"
                        ),
                      !t.headers.has("Content-Type"))
                    ) {
                      const g = t.detectContentTypeHeader();
                      null !== g && s.setRequestHeader("Content-Type", g);
                    }
                    if (t.responseType) {
                      const g = t.responseType.toLowerCase();
                      s.responseType = "json" !== g ? g : "text";
                    }
                    const a = t.serializeBody();
                    let u = null;
                    const c = () => {
                        if (null !== u) return u;
                        const g = s.statusText || "OK",
                          y = new Kt(s.getAllResponseHeaders()),
                          _ =
                            (function rk(e) {
                              return "responseURL" in e && e.responseURL
                                ? e.responseURL
                                : /^X-Request-URL:/m.test(
                                    e.getAllResponseHeaders()
                                  )
                                ? e.getResponseHeader("X-Request-URL")
                                : null;
                            })(s) || t.url;
                        return (
                          (u = new _f({
                            headers: y,
                            status: s.status,
                            statusText: g,
                            url: _,
                          })),
                          u
                        );
                      },
                      l = () => {
                        let {
                            headers: g,
                            status: y,
                            statusText: _,
                            url: m,
                          } = c(),
                          b = null;
                        204 !== y &&
                          (b =
                            typeof s.response > "u"
                              ? s.responseText
                              : s.response),
                          0 === y && (y = b ? 200 : 0);
                        let A = y >= 200 && y < 300;
                        if ("json" === t.responseType && "string" == typeof b) {
                          const H = b;
                          b = b.replace(nk, "");
                          try {
                            b = "" !== b ? JSON.parse(b) : null;
                          } catch (Ae) {
                            (b = H),
                              A && ((A = !1), (b = { error: Ae, text: b }));
                          }
                        }
                        A
                          ? (i.next(
                              new yo({
                                body: b,
                                headers: g,
                                status: y,
                                statusText: _,
                                url: m || void 0,
                              })
                            ),
                            i.complete())
                          : i.error(
                              new OC({
                                error: b,
                                headers: g,
                                status: y,
                                statusText: _,
                                url: m || void 0,
                              })
                            );
                      },
                      d = (g) => {
                        const { url: y } = c(),
                          _ = new OC({
                            error: g,
                            status: s.status || 0,
                            statusText: s.statusText || "Unknown Error",
                            url: y || void 0,
                          });
                        i.error(_);
                      };
                    let f = !1;
                    const h = (g) => {
                        f || (i.next(c()), (f = !0));
                        let y = { type: mo.DownloadProgress, loaded: g.loaded };
                        g.lengthComputable && (y.total = g.total),
                          "text" === t.responseType &&
                            s.responseText &&
                            (y.partialText = s.responseText),
                          i.next(y);
                      },
                      p = (g) => {
                        let y = { type: mo.UploadProgress, loaded: g.loaded };
                        g.lengthComputable && (y.total = g.total), i.next(y);
                      };
                    return (
                      s.addEventListener("load", l),
                      s.addEventListener("error", d),
                      s.addEventListener("timeout", d),
                      s.addEventListener("abort", d),
                      t.reportProgress &&
                        (s.addEventListener("progress", h),
                        null !== a &&
                          s.upload &&
                          s.upload.addEventListener("progress", p)),
                      s.send(a),
                      i.next({ type: mo.Sent }),
                      () => {
                        s.removeEventListener("error", d),
                          s.removeEventListener("abort", d),
                          s.removeEventListener("load", l),
                          s.removeEventListener("timeout", d),
                          t.reportProgress &&
                            (s.removeEventListener("progress", h),
                            null !== a &&
                              s.upload &&
                              s.upload.removeEventListener("progress", p)),
                          s.readyState !== s.DONE && s.abort();
                      }
                    );
                  })
              )
            );
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(aC));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      const wf = new I("XSRF_ENABLED"),
        $C = new I("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => "XSRF-TOKEN",
        }),
        UC = new I("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => "X-XSRF-TOKEN",
        });
      class zC {}
      let sk = (() => {
        class e {
          constructor(t, r, o) {
            (this.doc = t),
              (this.platform = r),
              (this.cookieName = o),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const t = this.doc.cookie || "";
            return (
              t !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = Y_(t, this.cookieName)),
                (this.lastCookieString = t)),
              this.lastToken
            );
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(mt), M(er), M($C));
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function ak(e, n) {
        const t = e.url.toLowerCase();
        if (
          !E(wf) ||
          "GET" === e.method ||
          "HEAD" === e.method ||
          t.startsWith("http://") ||
          t.startsWith("https://")
        )
          return n(e);
        const r = E(zC).getToken(),
          o = E(UC);
        return (
          null != r &&
            !e.headers.has(o) &&
            (e = e.clone({ headers: e.headers.set(o, r) })),
          n(e)
        );
      }
      var jn = (function (e) {
        return (
          (e[(e.Interceptors = 0)] = "Interceptors"),
          (e[(e.LegacyInterceptors = 1)] = "LegacyInterceptors"),
          (e[(e.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
          (e[(e.NoXsrfProtection = 3)] = "NoXsrfProtection"),
          (e[(e.JsonpSupport = 4)] = "JsonpSupport"),
          (e[(e.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
          (e[(e.Fetch = 6)] = "Fetch"),
          e
        );
      })(jn || {});
      function uk(...e) {
        const n = [
          PC,
          HC,
          jC,
          { provide: iu, useExisting: jC },
          { provide: su, useExisting: HC },
          { provide: ji, useValue: ak, multi: !0 },
          { provide: wf, useValue: !0 },
          { provide: zC, useClass: sk },
        ];
        for (const t of e) n.push(...t.ɵproviders);
        return (function cl(e) {
          return { ɵproviders: e };
        })(n);
      }
      const GC = new I("LEGACY_INTERCEPTOR_FN");
      function ck() {
        return (function ar(e, n) {
          return { ɵkind: e, ɵproviders: n };
        })(jn.LegacyInterceptors, [
          { provide: GC, useFactory: JF },
          { provide: ji, useExisting: GC, multi: !0 },
        ]);
      }
      let lk = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵmod = et({ type: e }));
          static #n = (this.ɵinj = $e({ providers: [uk(ck())] }));
        }
        return e;
      })();
      const { isArray: yk } = Array,
        { getPrototypeOf: vk, prototype: Dk, keys: _k } = Object;
      function qC(e) {
        if (1 === e.length) {
          const n = e[0];
          if (yk(n)) return { args: n, keys: null };
          if (
            (function Ck(e) {
              return e && "object" == typeof e && vk(e) === Dk;
            })(n)
          ) {
            const t = _k(n);
            return { args: t.map((r) => n[r]), keys: t };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: wk } = Array;
      function WC(e) {
        return Z((n) =>
          (function Ek(e, n) {
            return wk(n) ? e(...n) : e(n);
          })(e, n)
        );
      }
      function ZC(e, n) {
        return e.reduce((t, r, o) => ((t[r] = n[o]), t), {});
      }
      function Ef(...e) {
        const n = xo(e),
          t = Lh(e),
          { args: r, keys: o } = qC(e);
        if (0 === r.length) return be([], n);
        const i = new me(
          (function bk(e, n, t = bn) {
            return (r) => {
              YC(
                n,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let u = 0; u < o; u++)
                    YC(
                      n,
                      () => {
                        const c = be(e[u], n);
                        let l = !1;
                        c.subscribe(
                          _e(
                            r,
                            (d) => {
                              (i[u] = d),
                                l || ((l = !0), a--),
                                a || r.next(t(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, n, o ? (s) => ZC(o, s) : bn)
        );
        return t ? i.pipe(WC(t)) : i;
      }
      function YC(e, n, t) {
        e ? on(t, e, n) : n();
      }
      const cu = To(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function bf(...e) {
        return (function Ik() {
          return mr(1);
        })()(be(e, xo(e)));
      }
      function QC(e) {
        return new me((n) => {
          at(e()).subscribe(n);
        });
      }
      function Bi(e, n) {
        const t = ne(e) ? e : () => e,
          r = (o) => o.error(t());
        return new me(n ? (o) => n.schedule(r, 0, o) : r);
      }
      function If() {
        return Ee((e, n) => {
          let t = null;
          e._refCount++;
          const r = _e(n, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (t = null);
            const o = e._connection,
              i = t;
            (t = null),
              o && (!i || o === i) && o.unsubscribe(),
              n.unsubscribe();
          });
          e.subscribe(r), r.closed || (t = e.connect());
        });
      }
      class XC extends me {
        constructor(n, t) {
          super(),
            (this.source = n),
            (this.subjectFactory = t),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            wh(n) && (this.lift = n.lift);
        }
        _subscribe(n) {
          return this.getSubject().subscribe(n);
        }
        getSubject() {
          const n = this._subject;
          return (
            (!n || n.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: n } = this;
          (this._subject = this._connection = null), n?.unsubscribe();
        }
        connect() {
          let n = this._connection;
          if (!n) {
            n = this._connection = new st();
            const t = this.getSubject();
            n.add(
              this.source.subscribe(
                _e(
                  t,
                  void 0,
                  () => {
                    this._teardown(), t.complete();
                  },
                  (r) => {
                    this._teardown(), t.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              n.closed && ((this._connection = null), (n = st.EMPTY));
          }
          return n;
        }
        refCount() {
          return If()(this);
        }
      }
      function vo(e) {
        return e <= 0
          ? () => Ht
          : Ee((n, t) => {
              let r = 0;
              n.subscribe(
                _e(t, (o) => {
                  ++r <= e && (t.next(o), e <= r && t.complete());
                })
              );
            });
      }
      function lu(e) {
        return Ee((n, t) => {
          let r = !1;
          n.subscribe(
            _e(
              t,
              (o) => {
                (r = !0), t.next(o);
              },
              () => {
                r || t.next(e), t.complete();
              }
            )
          );
        });
      }
      function JC(e = Sk) {
        return Ee((n, t) => {
          let r = !1;
          n.subscribe(
            _e(
              t,
              (o) => {
                (r = !0), t.next(o);
              },
              () => (r ? t.complete() : t.error(e()))
            )
          );
        });
      }
      function Sk() {
        return new cu();
      }
      function ur(e, n) {
        const t = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? Cn((o, i) => e(o, i, r)) : bn,
            vo(1),
            t ? lu(n) : JC(() => new cu())
          );
      }
      function Be(e, n, t) {
        const r = ne(e) || n || t ? { next: e, error: n, complete: t } : e;
        return r
          ? Ee((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                _e(
                  i,
                  (u) => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, u),
                      i.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      i.complete();
                  },
                  (u) => {
                    var c;
                    (a = !1),
                      null === (c = r.error) || void 0 === c || c.call(r, u),
                      i.error(u);
                  },
                  () => {
                    var u, c;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (c = r.finalize) || void 0 === c || c.call(r);
                  }
                )
              );
            })
          : bn;
      }
      function cr(e) {
        return Ee((n, t) => {
          let i,
            r = null,
            o = !1;
          (r = n.subscribe(
            _e(t, void 0, void 0, (s) => {
              (i = at(e(s, cr(e)(n)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(t)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(t));
        });
      }
      function Mf(e) {
        return e <= 0
          ? () => Ht
          : Ee((n, t) => {
              let r = [];
              n.subscribe(
                _e(
                  t,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) t.next(o);
                    t.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      const B = "primary",
        Hi = Symbol("RouteTitle");
      class Ok {
        constructor(n) {
          this.params = n || {};
        }
        has(n) {
          return Object.prototype.hasOwnProperty.call(this.params, n);
        }
        get(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t[0] : t;
          }
          return null;
        }
        getAll(n) {
          if (this.has(n)) {
            const t = this.params[n];
            return Array.isArray(t) ? t : [t];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Do(e) {
        return new Ok(e);
      }
      function Pk(e, n, t) {
        const r = t.path.split("/");
        if (
          r.length > e.length ||
          ("full" === t.pathMatch && (n.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function en(e, n) {
        const t = e ? Object.keys(e) : void 0,
          r = n ? Object.keys(n) : void 0;
        if (!t || !r || t.length != r.length) return !1;
        let o;
        for (let i = 0; i < t.length; i++)
          if (((o = t[i]), !KC(e[o], n[o]))) return !1;
        return !0;
      }
      function KC(e, n) {
        if (Array.isArray(e) && Array.isArray(n)) {
          if (e.length !== n.length) return !1;
          const t = [...e].sort(),
            r = [...n].sort();
          return t.every((o, i) => r[i] === o);
        }
        return e === n;
      }
      function ew(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Bn(e) {
        return (function mk(e) {
          return !!e && (e instanceof me || (ne(e.lift) && ne(e.subscribe)));
        })(e)
          ? e
          : Di(e)
          ? be(Promise.resolve(e))
          : R(e);
      }
      const kk = {
          exact: function rw(e, n, t) {
            if (
              !lr(e.segments, n.segments) ||
              !du(e.segments, n.segments, t) ||
              e.numberOfChildren !== n.numberOfChildren
            )
              return !1;
            for (const r in n.children)
              if (!e.children[r] || !rw(e.children[r], n.children[r], t))
                return !1;
            return !0;
          },
          subset: ow,
        },
        tw = {
          exact: function Lk(e, n) {
            return en(e, n);
          },
          subset: function Vk(e, n) {
            return (
              Object.keys(n).length <= Object.keys(e).length &&
              Object.keys(n).every((t) => KC(e[t], n[t]))
            );
          },
          ignored: () => !0,
        };
      function nw(e, n, t) {
        return (
          kk[t.paths](e.root, n.root, t.matrixParams) &&
          tw[t.queryParams](e.queryParams, n.queryParams) &&
          !("exact" === t.fragment && e.fragment !== n.fragment)
        );
      }
      function ow(e, n, t) {
        return iw(e, n, n.segments, t);
      }
      function iw(e, n, t, r) {
        if (e.segments.length > t.length) {
          const o = e.segments.slice(0, t.length);
          return !(!lr(o, t) || n.hasChildren() || !du(o, t, r));
        }
        if (e.segments.length === t.length) {
          if (!lr(e.segments, t) || !du(e.segments, t, r)) return !1;
          for (const o in n.children)
            if (!e.children[o] || !ow(e.children[o], n.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = t.slice(0, e.segments.length),
            i = t.slice(e.segments.length);
          return (
            !!(lr(e.segments, o) && du(e.segments, o, r) && e.children[B]) &&
            iw(e.children[B], n, i, r)
          );
        }
      }
      function du(e, n, t) {
        return n.every((r, o) => tw[t](e[o].parameters, r.parameters));
      }
      class _o {
        constructor(n = new te([], {}), t = {}, r = null) {
          (this.root = n), (this.queryParams = t), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Do(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return Hk.serialize(this);
        }
      }
      class te {
        constructor(n, t) {
          (this.segments = n),
            (this.children = t),
            (this.parent = null),
            Object.values(t).forEach((r) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return fu(this);
        }
      }
      class $i {
        constructor(n, t) {
          (this.path = n), (this.parameters = t);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Do(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return uw(this);
        }
      }
      function lr(e, n) {
        return e.length === n.length && e.every((t, r) => t.path === n[r].path);
      }
      let Ui = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: function () {
              return new Sf();
            },
            providedIn: "root",
          }));
        }
        return e;
      })();
      class Sf {
        parse(n) {
          const t = new Jk(n);
          return new _o(
            t.parseRootSegment(),
            t.parseQueryParams(),
            t.parseFragment()
          );
        }
        serialize(n) {
          const t = `/${zi(n.root, !0)}`,
            r = (function zk(e) {
              const n = Object.keys(e)
                .map((t) => {
                  const r = e[t];
                  return Array.isArray(r)
                    ? r.map((o) => `${hu(t)}=${hu(o)}`).join("&")
                    : `${hu(t)}=${hu(r)}`;
                })
                .filter((t) => !!t);
              return n.length ? `?${n.join("&")}` : "";
            })(n.queryParams);
          return `${t}${r}${
            "string" == typeof n.fragment
              ? `#${(function $k(e) {
                  return encodeURI(e);
                })(n.fragment)}`
              : ""
          }`;
        }
      }
      const Hk = new Sf();
      function fu(e) {
        return e.segments.map((n) => uw(n)).join("/");
      }
      function zi(e, n) {
        if (!e.hasChildren()) return fu(e);
        if (n) {
          const t = e.children[B] ? zi(e.children[B], !1) : "",
            r = [];
          return (
            Object.entries(e.children).forEach(([o, i]) => {
              o !== B && r.push(`${o}:${zi(i, !1)}`);
            }),
            r.length > 0 ? `${t}(${r.join("//")})` : t
          );
        }
        {
          const t = (function Bk(e, n) {
            let t = [];
            return (
              Object.entries(e.children).forEach(([r, o]) => {
                r === B && (t = t.concat(n(o, r)));
              }),
              Object.entries(e.children).forEach(([r, o]) => {
                r !== B && (t = t.concat(n(o, r)));
              }),
              t
            );
          })(e, (r, o) =>
            o === B ? [zi(e.children[B], !1)] : [`${o}:${zi(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[B]
            ? `${fu(e)}/${t[0]}`
            : `${fu(e)}/(${t.join("//")})`;
        }
      }
      function sw(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function hu(e) {
        return sw(e).replace(/%3B/gi, ";");
      }
      function Af(e) {
        return sw(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function pu(e) {
        return decodeURIComponent(e);
      }
      function aw(e) {
        return pu(e.replace(/\+/g, "%20"));
      }
      function uw(e) {
        return `${Af(e.path)}${(function Uk(e) {
          return Object.keys(e)
            .map((n) => `;${Af(n)}=${Af(e[n])}`)
            .join("");
        })(e.parameters)}`;
      }
      const Gk = /^[^\/()?;#]+/;
      function Tf(e) {
        const n = e.match(Gk);
        return n ? n[0] : "";
      }
      const qk = /^[^\/()?;=#]+/,
        Zk = /^[^=?&#]+/,
        Qk = /^[^&#]+/;
      class Jk {
        constructor(n) {
          (this.url = n), (this.remaining = n);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new te([], {})
              : new te([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const n = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(n);
            } while (this.consumeOptional("&"));
          return n;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const n = [];
          for (
            this.peekStartsWith("(") || n.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), n.push(this.parseSegment());
          let t = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (t = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (n.length > 0 || Object.keys(t).length > 0) &&
              (r[B] = new te(n, t)),
            r
          );
        }
        parseSegment() {
          const n = Tf(this.remaining);
          if ("" === n && this.peekStartsWith(";")) throw new D(4009, !1);
          return this.capture(n), new $i(pu(n), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const n = {};
          for (; this.consumeOptional(";"); ) this.parseParam(n);
          return n;
        }
        parseParam(n) {
          const t = (function Wk(e) {
            const n = e.match(qk);
            return n ? n[0] : "";
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = Tf(this.remaining);
            o && ((r = o), this.capture(r));
          }
          n[pu(t)] = pu(r);
        }
        parseQueryParam(n) {
          const t = (function Yk(e) {
            const n = e.match(Zk);
            return n ? n[0] : "";
          })(this.remaining);
          if (!t) return;
          this.capture(t);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function Xk(e) {
              const n = e.match(Qk);
              return n ? n[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = aw(t),
            i = aw(r);
          if (n.hasOwnProperty(o)) {
            let s = n[o];
            Array.isArray(s) || ((s = [s]), (n[o] = s)), s.push(i);
          } else n[o] = i;
        }
        parseParens(n) {
          const t = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = Tf(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new D(4010, !1);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : n && (i = B);
            const s = this.parseChildren();
            (t[i] = 1 === Object.keys(s).length ? s[B] : new te([], s)),
              this.consumeOptional("//");
          }
          return t;
        }
        peekStartsWith(n) {
          return this.remaining.startsWith(n);
        }
        consumeOptional(n) {
          return (
            !!this.peekStartsWith(n) &&
            ((this.remaining = this.remaining.substring(n.length)), !0)
          );
        }
        capture(n) {
          if (!this.consumeOptional(n)) throw new D(4011, !1);
        }
      }
      function cw(e) {
        return e.segments.length > 0 ? new te([], { [B]: e }) : e;
      }
      function lw(e) {
        const n = {};
        for (const r of Object.keys(e.children)) {
          const i = lw(e.children[r]);
          if (r === B && 0 === i.segments.length && i.hasChildren())
            for (const [s, a] of Object.entries(i.children)) n[s] = a;
          else (i.segments.length > 0 || i.hasChildren()) && (n[r] = i);
        }
        return (function Kk(e) {
          if (1 === e.numberOfChildren && e.children[B]) {
            const n = e.children[B];
            return new te(e.segments.concat(n.segments), n.children);
          }
          return e;
        })(new te(e.segments, n));
      }
      function dr(e) {
        return e instanceof _o;
      }
      function dw(e) {
        let n;
        const o = cw(
          (function t(i) {
            const s = {};
            for (const u of i.children) {
              const c = t(u);
              s[u.outlet] = c;
            }
            const a = new te(i.url, s);
            return i === e && (n = a), a;
          })(e.root)
        );
        return n ?? o;
      }
      function fw(e, n, t, r) {
        let o = e;
        for (; o.parent; ) o = o.parent;
        if (0 === n.length) return Nf(o, o, o, t, r);
        const i = (function tL(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new pw(!0, 0, e);
          let n = 0,
            t = !1;
          const r = e.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  Object.entries(i.outlets).forEach(([u, c]) => {
                    a[u] = "string" == typeof c ? c.split("/") : c;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, u) => {
                  (0 == u && "." === a) ||
                    (0 == u && "" === a
                      ? (t = !0)
                      : ".." === a
                      ? n++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new pw(t, n, r);
        })(n);
        if (i.toRoot()) return Nf(o, o, new te([], {}), t, r);
        const s = (function nL(e, n, t) {
            if (e.isAbsolute) return new mu(n, !0, 0);
            if (!t) return new mu(n, !1, NaN);
            if (null === t.parent) return new mu(t, !0, 0);
            const r = gu(e.commands[0]) ? 0 : 1;
            return (function rL(e, n, t) {
              let r = e,
                o = n,
                i = t;
              for (; i > o; ) {
                if (((i -= o), (r = r.parent), !r)) throw new D(4005, !1);
                o = r.segments.length;
              }
              return new mu(r, !1, o - i);
            })(t, t.segments.length - 1 + r, e.numberOfDoubleDots);
          })(i, o, e),
          a = s.processChildren
            ? qi(s.segmentGroup, s.index, i.commands)
            : gw(s.segmentGroup, s.index, i.commands);
        return Nf(o, s.segmentGroup, a, t, r);
      }
      function gu(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Gi(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function Nf(e, n, t, r, o) {
        let s,
          i = {};
        r &&
          Object.entries(r).forEach(([u, c]) => {
            i[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
          }),
          (s = e === n ? t : hw(e, n, t));
        const a = cw(lw(s));
        return new _o(a, i, o);
      }
      function hw(e, n, t) {
        const r = {};
        return (
          Object.entries(e.children).forEach(([o, i]) => {
            r[o] = i === n ? t : hw(i, n, t);
          }),
          new te(e.segments, r)
        );
      }
      class pw {
        constructor(n, t, r) {
          if (
            ((this.isAbsolute = n),
            (this.numberOfDoubleDots = t),
            (this.commands = r),
            n && r.length > 0 && gu(r[0]))
          )
            throw new D(4003, !1);
          const o = r.find(Gi);
          if (o && o !== ew(r)) throw new D(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class mu {
        constructor(n, t, r) {
          (this.segmentGroup = n), (this.processChildren = t), (this.index = r);
        }
      }
      function gw(e, n, t) {
        if (
          (e || (e = new te([], {})),
          0 === e.segments.length && e.hasChildren())
        )
          return qi(e, n, t);
        const r = (function iL(e, n, t) {
            let r = 0,
              o = n;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= t.length) return i;
              const s = e.segments[o],
                a = t[r];
              if (Gi(a)) break;
              const u = `${a}`,
                c = r < t.length - 1 ? t[r + 1] : null;
              if (o > 0 && void 0 === u) break;
              if (u && c && "object" == typeof c && void 0 === c.outlets) {
                if (!yw(u, c, s)) return i;
                r += 2;
              } else {
                if (!yw(u, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, n, t),
          o = t.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new te(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[B] = new te(e.segments.slice(r.pathIndex), e.children)),
            qi(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new te(e.segments, {})
          : r.match && !e.hasChildren()
          ? Rf(e, n, t)
          : r.match
          ? qi(e, 0, o)
          : Rf(e, n, t);
      }
      function qi(e, n, t) {
        if (0 === t.length) return new te(e.segments, {});
        {
          const r = (function oL(e) {
              return Gi(e[0]) ? e[0].outlets : { [B]: e };
            })(t),
            o = {};
          if (
            Object.keys(r).some((i) => i !== B) &&
            e.children[B] &&
            1 === e.numberOfChildren &&
            0 === e.children[B].segments.length
          ) {
            const i = qi(e.children[B], n, t);
            return new te(e.segments, i.children);
          }
          return (
            Object.entries(r).forEach(([i, s]) => {
              "string" == typeof s && (s = [s]),
                null !== s && (o[i] = gw(e.children[i], n, s));
            }),
            Object.entries(e.children).forEach(([i, s]) => {
              void 0 === r[i] && (o[i] = s);
            }),
            new te(e.segments, o)
          );
        }
      }
      function Rf(e, n, t) {
        const r = e.segments.slice(0, n);
        let o = 0;
        for (; o < t.length; ) {
          const i = t[o];
          if (Gi(i)) {
            const u = sL(i.outlets);
            return new te(r, u);
          }
          if (0 === o && gu(t[0])) {
            r.push(new $i(e.segments[n].path, mw(t[0]))), o++;
            continue;
          }
          const s = Gi(i) ? i.outlets[B] : `${i}`,
            a = o < t.length - 1 ? t[o + 1] : null;
          s && a && gu(a)
            ? (r.push(new $i(s, mw(a))), (o += 2))
            : (r.push(new $i(s, {})), o++);
        }
        return new te(r, {});
      }
      function sL(e) {
        const n = {};
        return (
          Object.entries(e).forEach(([t, r]) => {
            "string" == typeof r && (r = [r]),
              null !== r && (n[t] = Rf(new te([], {}), 0, r));
          }),
          n
        );
      }
      function mw(e) {
        const n = {};
        return Object.entries(e).forEach(([t, r]) => (n[t] = `${r}`)), n;
      }
      function yw(e, n, t) {
        return e == t.path && en(n, t.parameters);
      }
      const Wi = "imperative";
      class tn {
        constructor(n, t) {
          (this.id = n), (this.url = t);
        }
      }
      class yu extends tn {
        constructor(n, t, r = "imperative", o = null) {
          super(n, t),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Hn extends tn {
        constructor(n, t, r) {
          super(n, t), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Zi extends tn {
        constructor(n, t, r, o) {
          super(n, t), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Co extends tn {
        constructor(n, t, r, o) {
          super(n, t), (this.reason = r), (this.code = o), (this.type = 16);
        }
      }
      class vu extends tn {
        constructor(n, t, r, o) {
          super(n, t), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class vw extends tn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class aL extends tn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class uL extends tn {
        constructor(n, t, r, o, i) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class cL extends tn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class lL extends tn {
        constructor(n, t, r, o) {
          super(n, t),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class dL {
        constructor(n) {
          (this.route = n), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class fL {
        constructor(n) {
          (this.route = n), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class hL {
        constructor(n) {
          (this.snapshot = n), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class pL {
        constructor(n) {
          (this.snapshot = n), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class gL {
        constructor(n) {
          (this.snapshot = n), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class mL {
        constructor(n) {
          (this.snapshot = n), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Dw {
        constructor(n, t, r) {
          (this.routerEvent = n),
            (this.position = t),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class xf {}
      class Of {
        constructor(n) {
          this.url = n;
        }
      }
      class yL {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new Yi()),
            (this.attachRef = null);
        }
      }
      let Yi = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(t, r) {
            const o = this.getOrCreateContext(t);
            (o.outlet = r), this.contexts.set(t, o);
          }
          onChildOutletDestroyed(t) {
            const r = this.getContext(t);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const t = this.contexts;
            return (this.contexts = new Map()), t;
          }
          onOutletReAttached(t) {
            this.contexts = t;
          }
          getOrCreateContext(t) {
            let r = this.getContext(t);
            return r || ((r = new yL()), this.contexts.set(t, r)), r;
          }
          getContext(t) {
            return this.contexts.get(t) || null;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      class _w {
        constructor(n) {
          this._root = n;
        }
        get root() {
          return this._root.value;
        }
        parent(n) {
          const t = this.pathFromRoot(n);
          return t.length > 1 ? t[t.length - 2] : null;
        }
        children(n) {
          const t = Pf(n, this._root);
          return t ? t.children.map((r) => r.value) : [];
        }
        firstChild(n) {
          const t = Pf(n, this._root);
          return t && t.children.length > 0 ? t.children[0].value : null;
        }
        siblings(n) {
          const t = Ff(n, this._root);
          return t.length < 2
            ? []
            : t[t.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== n);
        }
        pathFromRoot(n) {
          return Ff(n, this._root).map((t) => t.value);
        }
      }
      function Pf(e, n) {
        if (e === n.value) return n;
        for (const t of n.children) {
          const r = Pf(e, t);
          if (r) return r;
        }
        return null;
      }
      function Ff(e, n) {
        if (e === n.value) return [n];
        for (const t of n.children) {
          const r = Ff(e, t);
          if (r.length) return r.unshift(n), r;
        }
        return [];
      }
      class wn {
        constructor(n, t) {
          (this.value = n), (this.children = t);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function wo(e) {
        const n = {};
        return e && e.children.forEach((t) => (n[t.value.outlet] = t)), n;
      }
      class Cw extends _w {
        constructor(n, t) {
          super(n), (this.snapshot = t), kf(this, n);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function ww(e, n) {
        const t = (function vL(e, n) {
            const s = new Du([], {}, {}, "", {}, B, n, null, {});
            return new bw("", new wn(s, []));
          })(0, n),
          r = new vt([new $i("", {})]),
          o = new vt({}),
          i = new vt({}),
          s = new vt({}),
          a = new vt(""),
          u = new Eo(r, o, s, a, i, B, n, t.root);
        return (u.snapshot = t.root), new Cw(new wn(u, []), t);
      }
      class Eo {
        constructor(n, t, r, o, i, s, a, u) {
          (this.urlSubject = n),
            (this.paramsSubject = t),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = o),
            (this.dataSubject = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = u),
            (this.title = this.dataSubject?.pipe(Z((c) => c[Hi])) ?? R(void 0)),
            (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(Z((n) => Do(n)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(Z((n) => Do(n)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function Ew(e, n = "emptyOnly") {
        const t = e.pathFromRoot;
        let r = 0;
        if ("always" !== n)
          for (r = t.length - 1; r >= 1; ) {
            const o = t[r],
              i = t[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function DL(e) {
          return e.reduce(
            (n, t) => ({
              params: { ...n.params, ...t.params },
              data: { ...n.data, ...t.data },
              resolve: {
                ...t.data,
                ...n.resolve,
                ...t.routeConfig?.data,
                ...t._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(t.slice(r));
      }
      class Du {
        get title() {
          return this.data?.[Hi];
        }
        constructor(n, t, r, o, i, s, a, u, c) {
          (this.url = n),
            (this.params = t),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = u),
            (this._resolve = c);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Do(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Do(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class bw extends _w {
        constructor(n, t) {
          super(t), (this.url = n), kf(this, t);
        }
        toString() {
          return Iw(this._root);
        }
      }
      function kf(e, n) {
        (n.value._routerState = e), n.children.forEach((t) => kf(e, t));
      }
      function Iw(e) {
        const n =
          e.children.length > 0 ? ` { ${e.children.map(Iw).join(", ")} } ` : "";
        return `${e.value}${n}`;
      }
      function Lf(e) {
        if (e.snapshot) {
          const n = e.snapshot,
            t = e._futureSnapshot;
          (e.snapshot = t),
            en(n.queryParams, t.queryParams) ||
              e.queryParamsSubject.next(t.queryParams),
            n.fragment !== t.fragment && e.fragmentSubject.next(t.fragment),
            en(n.params, t.params) || e.paramsSubject.next(t.params),
            (function Fk(e, n) {
              if (e.length !== n.length) return !1;
              for (let t = 0; t < e.length; ++t) if (!en(e[t], n[t])) return !1;
              return !0;
            })(n.url, t.url) || e.urlSubject.next(t.url),
            en(n.data, t.data) || e.dataSubject.next(t.data);
        } else
          (e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data);
      }
      function Vf(e, n) {
        const t =
          en(e.params, n.params) &&
          (function jk(e, n) {
            return (
              lr(e, n) && e.every((t, r) => en(t.parameters, n[r].parameters))
            );
          })(e.url, n.url);
        return (
          t &&
          !(!e.parent != !n.parent) &&
          (!e.parent || Vf(e.parent, n.parent))
        );
      }
      let jf = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = B),
              (this.activateEvents = new de()),
              (this.deactivateEvents = new de()),
              (this.attachEvents = new de()),
              (this.detachEvents = new de()),
              (this.parentContexts = E(Yi)),
              (this.location = E(Lt)),
              (this.changeDetector = E(Ha)),
              (this.environmentInjector = E(ft)),
              (this.inputBinder = E(_u, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(t) {
            if (t.name) {
              const { firstChange: r, previousValue: o } = t.name;
              if (r) return;
              this.isTrackedInParentContexts(o) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(t) {
            return this.parentContexts.getContext(t)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const t = this.parentContexts.getContext(this.name);
            t?.route &&
              (t.attachRef
                ? this.attach(t.attachRef, t.route)
                : this.activateWith(t.route, t.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new D(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new D(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new D(4012, !1);
            this.location.detach();
            const t = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(t.instance),
              t
            );
          }
          attach(t, r) {
            (this.activated = t),
              (this._activatedRoute = r),
              this.location.insert(t.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(t.instance);
          }
          deactivate() {
            if (this.activated) {
              const t = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(t);
            }
          }
          activateWith(t, r) {
            if (this.isActivated) throw new D(4013, !1);
            this._activatedRoute = t;
            const o = this.location,
              s = t.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new _L(t, a, o.injector);
            (this.activated = o.createComponent(s, {
              index: o.length,
              injector: u,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵdir = F({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Ct],
          }));
        }
        return e;
      })();
      class _L {
        constructor(n, t, r) {
          (this.route = n), (this.childContexts = t), (this.parent = r);
        }
        get(n, t) {
          return n === Eo
            ? this.route
            : n === Yi
            ? this.childContexts
            : this.parent.get(n, t);
        }
      }
      const _u = new I("");
      let Mw = (() => {
        class e {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(t) {
            this.unsubscribeFromRouteData(t), this.subscribeToRouteData(t);
          }
          unsubscribeFromRouteData(t) {
            this.outletDataSubscriptions.get(t)?.unsubscribe(),
              this.outletDataSubscriptions.delete(t);
          }
          subscribeToRouteData(t) {
            const { activatedRoute: r } = t,
              o = Ef([r.queryParams, r.params, r.data])
                .pipe(
                  Tt(
                    ([i, s, a], u) => (
                      (a = { ...i, ...s, ...a }),
                      0 === u ? R(a) : Promise.resolve(a)
                    )
                  )
                )
                .subscribe((i) => {
                  if (
                    !t.isActivated ||
                    !t.activatedComponentRef ||
                    t.activatedRoute !== r ||
                    null === r.component
                  )
                    return void this.unsubscribeFromRouteData(t);
                  const s = (function DP(e) {
                    const n = G(e);
                    if (!n) return null;
                    const t = new pi(n);
                    return {
                      get selector() {
                        return t.selector;
                      },
                      get type() {
                        return t.componentType;
                      },
                      get inputs() {
                        return t.inputs;
                      },
                      get outputs() {
                        return t.outputs;
                      },
                      get ngContentSelectors() {
                        return t.ngContentSelectors;
                      },
                      get isStandalone() {
                        return n.standalone;
                      },
                      get isSignal() {
                        return n.signals;
                      },
                    };
                  })(r.component);
                  if (s)
                    for (const { templateName: a } of s.inputs)
                      t.activatedComponentRef.setInput(a, i[a]);
                  else this.unsubscribeFromRouteData(t);
                });
            this.outletDataSubscriptions.set(t, o);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function Qi(e, n, t) {
        if (t && e.shouldReuseRoute(n.value, t.value.snapshot)) {
          const r = t.value;
          r._futureSnapshot = n.value;
          const o = (function wL(e, n, t) {
            return n.children.map((r) => {
              for (const o of t.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return Qi(e, r, o);
              return Qi(e, r);
            });
          })(e, n, t);
          return new wn(r, o);
        }
        {
          if (e.shouldAttach(n.value)) {
            const i = e.retrieve(n.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = n.value),
                (s.children = n.children.map((a) => Qi(e, a))),
                s
              );
            }
          }
          const r = (function EL(e) {
              return new Eo(
                new vt(e.url),
                new vt(e.params),
                new vt(e.queryParams),
                new vt(e.fragment),
                new vt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(n.value),
            o = n.children.map((i) => Qi(e, i));
          return new wn(r, o);
        }
      }
      const Bf = "ngNavigationCancelingError";
      function Sw(e, n) {
        const { redirectTo: t, navigationBehaviorOptions: r } = dr(n)
            ? { redirectTo: n, navigationBehaviorOptions: void 0 }
            : n,
          o = Aw(!1, 0, n);
        return (o.url = t), (o.navigationBehaviorOptions = r), o;
      }
      function Aw(e, n, t) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Bf] = !0), (r.cancellationCode = n), t && (r.url = t), r;
      }
      function Tw(e) {
        return e && e[Bf];
      }
      let Nw = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵcmp = Ue({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [uD],
            decls: 1,
            vars: 0,
            template: function (r, o) {
              1 & r && bt(0, "router-outlet");
            },
            dependencies: [jf],
            encapsulation: 2,
          }));
        }
        return e;
      })();
      function Hf(e) {
        const n = e.children && e.children.map(Hf),
          t = n ? { ...e, children: n } : { ...e };
        return (
          !t.component &&
            !t.loadComponent &&
            (n || t.loadChildren) &&
            t.outlet &&
            t.outlet !== B &&
            (t.component = Nw),
          t
        );
      }
      function Bt(e) {
        return e.outlet || B;
      }
      function Xi(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let n = e.parent; n; n = n.parent) {
          const t = n.routeConfig;
          if (t?._loadedInjector) return t._loadedInjector;
          if (t?._injector) return t._injector;
        }
        return null;
      }
      class RL {
        constructor(n, t, r, o, i) {
          (this.routeReuseStrategy = n),
            (this.futureState = t),
            (this.currState = r),
            (this.forwardEvent = o),
            (this.inputBindingEnabled = i);
        }
        activate(n) {
          const t = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(t, r, n),
            Lf(this.futureState.root),
            this.activateChildRoutes(t, r, n);
        }
        deactivateChildRoutes(n, t, r) {
          const o = wo(t);
          n.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Object.values(o).forEach((i) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(n, t, r) {
          const o = n.value,
            i = t ? t.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(n, t, s.children);
            } else this.deactivateChildRoutes(n, t, r);
          else i && this.deactivateRouteAndItsChildren(t, r);
        }
        deactivateRouteAndItsChildren(n, t) {
          n.value.component &&
          this.routeReuseStrategy.shouldDetach(n.value.snapshot)
            ? this.detachAndStoreRouteSubtree(n, t)
            : this.deactivateRouteAndOutlet(n, t);
        }
        detachAndStoreRouteSubtree(n, t) {
          const r = t.getContext(n.value.outlet),
            o = r && n.value.component ? r.children : t,
            i = wo(n);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(n.value.snapshot, {
              componentRef: s,
              route: n,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(n, t) {
          const r = t.getContext(n.value.outlet),
            o = r && n.value.component ? r.children : t,
            i = wo(n);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(n, t, r) {
          const o = wo(t);
          n.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new mL(i.value.snapshot));
          }),
            n.children.length && this.forwardEvent(new pL(n.value.snapshot));
        }
        activateRoutes(n, t, r) {
          const o = n.value,
            i = t ? t.value : null;
          if ((Lf(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(n, t, s.children);
            } else this.activateChildRoutes(n, t, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Lf(a.route.value),
                this.activateChildRoutes(n, null, s.children);
            } else {
              const a = Xi(o.snapshot);
              (s.attachRef = null),
                (s.route = o),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(n, null, s.children);
            }
          } else this.activateChildRoutes(n, null, r);
        }
      }
      class Rw {
        constructor(n) {
          (this.path = n), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Cu {
        constructor(n, t) {
          (this.component = n), (this.route = t);
        }
      }
      function xL(e, n, t) {
        const r = e._root;
        return Ji(r, n ? n._root : null, t, [r.value]);
      }
      function bo(e, n) {
        const t = Symbol(),
          r = n.get(e, t);
        return r === t
          ? "function" != typeof e ||
            (function bI(e) {
              return null !== ms(e);
            })(e)
            ? n.get(e)
            : e
          : r;
      }
      function Ji(
        e,
        n,
        t,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = wo(n);
        return (
          e.children.forEach((s) => {
            (function PL(
              e,
              n,
              t,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = e.value,
                s = n ? n.value : null,
                a = t ? t.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const u = (function FL(e, n, t) {
                  if ("function" == typeof t) return t(e, n);
                  switch (t) {
                    case "pathParamsChange":
                      return !lr(e.url, n.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !lr(e.url, n.url) || !en(e.queryParams, n.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Vf(e, n) || !en(e.queryParams, n.queryParams);
                    default:
                      return !Vf(e, n);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                u
                  ? o.canActivateChecks.push(new Rw(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  Ji(e, n, i.component ? (a ? a.children : null) : t, r, o),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new Cu(a.outlet.component, s));
              } else
                s && Ki(n, a, o),
                  o.canActivateChecks.push(new Rw(r)),
                  Ji(e, null, i.component ? (a ? a.children : null) : t, r, o);
            })(s, i[s.value.outlet], t, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Object.entries(i).forEach(([s, a]) => Ki(a, t.getContext(s), o)),
          o
        );
      }
      function Ki(e, n, t) {
        const r = wo(e),
          o = e.value;
        Object.entries(r).forEach(([i, s]) => {
          Ki(s, o.component ? (n ? n.children.getContext(i) : null) : n, t);
        }),
          t.canDeactivateChecks.push(
            new Cu(
              o.component && n && n.outlet && n.outlet.isActivated
                ? n.outlet.component
                : null,
              o
            )
          );
      }
      function es(e) {
        return "function" == typeof e;
      }
      function xw(e) {
        return e instanceof cu || "EmptyError" === e?.name;
      }
      const wu = Symbol("INITIAL_VALUE");
      function Io() {
        return Tt((e) =>
          Ef(
            e.map((n) =>
              n.pipe(
                vo(1),
                (function Mk(...e) {
                  const n = xo(e);
                  return Ee((t, r) => {
                    (n ? bf(e, t, n) : bf(e, t)).subscribe(r);
                  });
                })(wu)
              )
            )
          ).pipe(
            Z((n) => {
              for (const t of n)
                if (!0 !== t) {
                  if (t === wu) return wu;
                  if (!1 === t || t instanceof _o) return t;
                }
              return !0;
            }),
            Cn((n) => n !== wu),
            vo(1)
          )
        );
      }
      function Ow(e) {
        return (function Mb(...e) {
          return Dh(e);
        })(
          Be((n) => {
            if (dr(n)) throw Sw(0, n);
          }),
          Z((n) => !0 === n)
        );
      }
      class Eu {
        constructor(n) {
          this.segmentGroup = n || null;
        }
      }
      class Pw {
        constructor(n) {
          this.urlTree = n;
        }
      }
      function Mo(e) {
        return Bi(new Eu(e));
      }
      function Fw(e) {
        return Bi(new Pw(e));
      }
      class tV {
        constructor(n, t) {
          (this.urlSerializer = n), (this.urlTree = t);
        }
        noMatchError(n) {
          return new D(4002, !1);
        }
        lineralizeSegments(n, t) {
          let r = [],
            o = t.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return R(r);
            if (o.numberOfChildren > 1 || !o.children[B])
              return Bi(new D(4e3, !1));
            o = o.children[B];
          }
        }
        applyRedirectCommands(n, t, r) {
          return this.applyRedirectCreateUrlTree(
            t,
            this.urlSerializer.parse(t),
            n,
            r
          );
        }
        applyRedirectCreateUrlTree(n, t, r, o) {
          const i = this.createSegmentGroup(n, t.root, r, o);
          return new _o(
            i,
            this.createQueryParams(t.queryParams, this.urlTree.queryParams),
            t.fragment
          );
        }
        createQueryParams(n, t) {
          const r = {};
          return (
            Object.entries(n).forEach(([o, i]) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = t[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(n, t, r, o) {
          const i = this.createSegments(n, t.segments, r, o);
          let s = {};
          return (
            Object.entries(t.children).forEach(([a, u]) => {
              s[a] = this.createSegmentGroup(n, u, r, o);
            }),
            new te(i, s)
          );
        }
        createSegments(n, t, r, o) {
          return t.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(n, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(n, t, r) {
          const o = r[t.path.substring(1)];
          if (!o) throw new D(4001, !1);
          return o;
        }
        findOrReturn(n, t) {
          let r = 0;
          for (const o of t) {
            if (o.path === n.path) return t.splice(r), o;
            r++;
          }
          return n;
        }
      }
      const $f = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function nV(e, n, t, r, o) {
        const i = Uf(e, n, t);
        return i.matched
          ? ((r = (function IL(e, n) {
              return (
                e.providers &&
                  !e._injector &&
                  (e._injector = hd(e.providers, n, `Route: ${e.path}`)),
                e._injector ?? n
              );
            })(n, r)),
            (function JL(e, n, t, r) {
              const o = n.canMatch;
              return o && 0 !== o.length
                ? R(
                    o.map((s) => {
                      const a = bo(s, e);
                      return Bn(
                        (function HL(e) {
                          return e && es(e.canMatch);
                        })(a)
                          ? a.canMatch(n, t)
                          : e.runInContext(() => a(n, t))
                      );
                    })
                  ).pipe(Io(), Ow())
                : R(!0);
            })(r, n, t).pipe(Z((s) => (!0 === s ? i : { ...$f }))))
          : R(i);
      }
      function Uf(e, n, t) {
        if ("" === n.path)
          return "full" === n.pathMatch && (e.hasChildren() || t.length > 0)
            ? { ...$f }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: t,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (n.matcher || Pk)(t, e, n);
        if (!o) return { ...$f };
        const i = {};
        Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
          i[a] = u.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: t.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function kw(e, n, t, r) {
        return t.length > 0 &&
          (function iV(e, n, t) {
            return t.some((r) => bu(e, n, r) && Bt(r) !== B);
          })(e, t, r)
          ? {
              segmentGroup: new te(n, oV(r, new te(t, e.children))),
              slicedSegments: [],
            }
          : 0 === t.length &&
            (function sV(e, n, t) {
              return t.some((r) => bu(e, n, r));
            })(e, t, r)
          ? {
              segmentGroup: new te(e.segments, rV(e, 0, t, r, e.children)),
              slicedSegments: t,
            }
          : { segmentGroup: new te(e.segments, e.children), slicedSegments: t };
      }
      function rV(e, n, t, r, o) {
        const i = {};
        for (const s of r)
          if (bu(e, t, s) && !o[Bt(s)]) {
            const a = new te([], {});
            i[Bt(s)] = a;
          }
        return { ...o, ...i };
      }
      function oV(e, n) {
        const t = {};
        t[B] = n;
        for (const r of e)
          if ("" === r.path && Bt(r) !== B) {
            const o = new te([], {});
            t[Bt(r)] = o;
          }
        return t;
      }
      function bu(e, n, t) {
        return (
          (!(e.hasChildren() || n.length > 0) || "full" !== t.pathMatch) &&
          "" === t.path
        );
      }
      class lV {
        constructor(n, t, r, o, i, s, a) {
          (this.injector = n),
            (this.configLoader = t),
            (this.rootComponentType = r),
            (this.config = o),
            (this.urlTree = i),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new tV(this.urlSerializer, this.urlTree));
        }
        noMatchError(n) {
          return new D(4002, !1);
        }
        recognize() {
          const n = kw(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            n,
            B
          ).pipe(
            cr((t) => {
              if (t instanceof Pw)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = t.urlTree),
                  this.match(t.urlTree)
                );
              throw t instanceof Eu ? this.noMatchError(t) : t;
            }),
            Z((t) => {
              const r = new Du(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  B,
                  this.rootComponentType,
                  null,
                  {}
                ),
                o = new wn(r, t),
                i = new bw("", o),
                s = (function eL(e, n, t = null, r = null) {
                  return fw(dw(e), n, t, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (i.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(i._root),
                { state: i, tree: s }
              );
            })
          );
        }
        match(n) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            n.root,
            B
          ).pipe(
            cr((r) => {
              throw r instanceof Eu ? this.noMatchError(r) : r;
            })
          );
        }
        inheritParamsAndData(n) {
          const t = n.value,
            r = Ew(t, this.paramsInheritanceStrategy);
          (t.params = Object.freeze(r.params)),
            (t.data = Object.freeze(r.data)),
            n.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(n, t, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(n, t, r)
            : this.processSegment(n, t, r, r.segments, o, !0);
        }
        processChildren(n, t, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return be(o).pipe(
            go((i) => {
              const s = r.children[i],
                a = (function TL(e, n) {
                  const t = e.filter((r) => Bt(r) === n);
                  return t.push(...e.filter((r) => Bt(r) !== n)), t;
                })(t, i);
              return this.processSegmentGroup(n, a, s, i);
            }),
            (function Tk(e, n) {
              return Ee(
                (function Ak(e, n, t, r, o) {
                  return (i, s) => {
                    let a = t,
                      u = n,
                      c = 0;
                    i.subscribe(
                      _e(
                        s,
                        (l) => {
                          const d = c++;
                          (u = a ? e(u, l, d) : ((a = !0), l)), r && s.next(u);
                        },
                        o &&
                          (() => {
                            a && s.next(u), s.complete();
                          })
                      )
                    );
                  };
                })(e, n, arguments.length >= 2, !0)
              );
            })((i, s) => (i.push(...s), i)),
            lu(null),
            (function Nk(e, n) {
              const t = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? Cn((o, i) => e(o, i, r)) : bn,
                  Mf(1),
                  t ? lu(n) : JC(() => new cu())
                );
            })(),
            Te((i) => {
              if (null === i) return Mo(r);
              const s = Lw(i);
              return (
                (function dV(e) {
                  e.sort((n, t) =>
                    n.value.outlet === B
                      ? -1
                      : t.value.outlet === B
                      ? 1
                      : n.value.outlet.localeCompare(t.value.outlet)
                  );
                })(s),
                R(s)
              );
            })
          );
        }
        processSegment(n, t, r, o, i, s) {
          return be(t).pipe(
            go((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? n,
                t,
                a,
                r,
                o,
                i,
                s
              ).pipe(
                cr((u) => {
                  if (u instanceof Eu) return R(null);
                  throw u;
                })
              )
            ),
            ur((a) => !!a),
            cr((a) => {
              if (xw(a))
                return (function uV(e, n, t) {
                  return 0 === n.length && !e.children[t];
                })(r, o, i)
                  ? R([])
                  : Mo(r);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(n, t, r, o, i, s, a) {
          return (function aV(e, n, t, r) {
            return (
              !!(Bt(e) === r || (r !== B && bu(n, t, e))) &&
              ("**" === e.path || Uf(n, e, t).matched)
            );
          })(r, o, i, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(n, o, r, i, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(n, o, t, r, i, s)
              : Mo(o)
            : Mo(o);
        }
        expandSegmentAgainstRouteUsingRedirect(n, t, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                n,
                t,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(n, t, r, o) {
          const i = this.applyRedirects.applyRedirectCommands(
            [],
            r.redirectTo,
            {}
          );
          return r.redirectTo.startsWith("/")
            ? Fw(i)
            : this.applyRedirects.lineralizeSegments(r, i).pipe(
                Te((s) => {
                  const a = new te(s, {});
                  return this.processSegment(n, t, a, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(n, t, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: c,
            positionalParamSegments: l,
          } = Uf(t, o, i);
          if (!a) return Mo(t);
          const d = this.applyRedirects.applyRedirectCommands(
            u,
            o.redirectTo,
            l
          );
          return o.redirectTo.startsWith("/")
            ? Fw(d)
            : this.applyRedirects
                .lineralizeSegments(o, d)
                .pipe(
                  Te((f) => this.processSegment(n, r, t, f.concat(c), s, !1))
                );
        }
        matchSegmentAgainstRoute(n, t, r, o, i, s) {
          let a;
          if ("**" === r.path) {
            const u = o.length > 0 ? ew(o).parameters : {};
            (a = R({
              snapshot: new Du(
                o,
                u,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                Vw(r),
                Bt(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                jw(r)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (t.children = {});
          } else
            a = nV(t, r, o, n).pipe(
              Z(
                ({
                  matched: u,
                  consumedSegments: c,
                  remainingSegments: l,
                  parameters: d,
                }) =>
                  u
                    ? {
                        snapshot: new Du(
                          c,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          Vw(r),
                          Bt(r),
                          r.component ?? r._loadedComponent ?? null,
                          r,
                          jw(r)
                        ),
                        consumedSegments: c,
                        remainingSegments: l,
                      }
                    : null
              )
            );
          return a.pipe(
            Tt((u) =>
              null === u
                ? Mo(t)
                : this.getChildConfig((n = r._injector ?? n), r, o).pipe(
                    Tt(({ routes: c }) => {
                      const l = r._loadedInjector ?? n,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = u,
                        { segmentGroup: p, slicedSegments: g } = kw(t, f, h, c);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(l, c, p).pipe(
                          Z((_) => (null === _ ? null : [new wn(d, _)]))
                        );
                      if (0 === c.length && 0 === g.length)
                        return R([new wn(d, [])]);
                      const y = Bt(r) === i;
                      return this.processSegment(
                        l,
                        c,
                        p,
                        g,
                        y ? B : i,
                        !0
                      ).pipe(Z((_) => [new wn(d, _)]));
                    })
                  )
            )
          );
        }
        getChildConfig(n, t, r) {
          return t.children
            ? R({ routes: t.children, injector: n })
            : t.loadChildren
            ? void 0 !== t._loadedRoutes
              ? R({ routes: t._loadedRoutes, injector: t._loadedInjector })
              : (function XL(e, n, t, r) {
                  const o = n.canLoad;
                  return void 0 === o || 0 === o.length
                    ? R(!0)
                    : R(
                        o.map((s) => {
                          const a = bo(s, e);
                          return Bn(
                            (function LL(e) {
                              return e && es(e.canLoad);
                            })(a)
                              ? a.canLoad(n, t)
                              : e.runInContext(() => a(n, t))
                          );
                        })
                      ).pipe(Io(), Ow());
                })(n, t, r).pipe(
                  Te((o) =>
                    o
                      ? this.configLoader.loadChildren(n, t).pipe(
                          Be((i) => {
                            (t._loadedRoutes = i.routes),
                              (t._loadedInjector = i.injector);
                          })
                        )
                      : (function eV(e) {
                          return Bi(Aw(!1, 3));
                        })()
                  )
                )
            : R({ routes: [], injector: n });
        }
      }
      function fV(e) {
        const n = e.value.routeConfig;
        return n && "" === n.path;
      }
      function Lw(e) {
        const n = [],
          t = new Set();
        for (const r of e) {
          if (!fV(r)) {
            n.push(r);
            continue;
          }
          const o = n.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), t.add(o)) : n.push(r);
        }
        for (const r of t) {
          const o = Lw(r.children);
          n.push(new wn(r.value, o));
        }
        return n.filter((r) => !t.has(r));
      }
      function Vw(e) {
        return e.data || {};
      }
      function jw(e) {
        return e.resolve || {};
      }
      function Bw(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function zf(e) {
        return Tt((n) => {
          const t = e(n);
          return t ? be(t).pipe(Z(() => n)) : R(n);
        });
      }
      const So = new I("ROUTES");
      let Gf = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = E(n_));
          }
          loadComponent(t) {
            if (this.componentLoaders.get(t))
              return this.componentLoaders.get(t);
            if (t._loadedComponent) return R(t._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(t);
            const r = Bn(t.loadComponent()).pipe(
                Z(Hw),
                Be((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(t),
                    (t._loadedComponent = i);
                }),
                Li(() => {
                  this.componentLoaders.delete(t);
                })
              ),
              o = new XC(r, () => new At()).pipe(If());
            return this.componentLoaders.set(t, o), o;
          }
          loadChildren(t, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return R({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = (function DV(e, n, t, r) {
                return Bn(e.loadChildren()).pipe(
                  Z(Hw),
                  Te((o) =>
                    o instanceof sD || Array.isArray(o)
                      ? R(o)
                      : be(n.compileModuleAsync(o))
                  ),
                  Z((o) => {
                    r && r(e);
                    let i,
                      s,
                      a = !1;
                    return (
                      Array.isArray(o)
                        ? ((s = o), !0)
                        : ((i = o.create(t).injector),
                          (s = i
                            .get(So, [], { optional: !0, self: !0 })
                            .flat())),
                      { routes: s.map(Hf), injector: i }
                    );
                  })
                );
              })(r, this.compiler, t, this.onLoadEndListener).pipe(
                Li(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new XC(i, () => new At()).pipe(If());
            return this.childrenLoaders.set(r, s), s;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function Hw(e) {
        return (function _V(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let Iu = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.currentTransition = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new At()),
              (this.transitionAbortSubject = new At()),
              (this.configLoader = E(Gf)),
              (this.environmentInjector = E(ft)),
              (this.urlSerializer = E(Ui)),
              (this.rootContexts = E(Yi)),
              (this.inputBindingEnabled = null !== E(_u, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => R(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (o) =>
                this.events.next(new fL(o))),
              (this.configLoader.onLoadStartListener = (o) =>
                this.events.next(new dL(o)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(t) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...t, id: r });
          }
          setupNavigations(t, r, o) {
            return (
              (this.transitions = new vt({
                id: 0,
                currentUrlTree: r,
                currentRawUrl: r,
                currentBrowserUrl: r,
                extractedUrl: t.urlHandlingStrategy.extract(r),
                urlAfterRedirects: t.urlHandlingStrategy.extract(r),
                rawUrl: r,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Wi,
                restoredState: null,
                currentSnapshot: o.snapshot,
                targetSnapshot: null,
                currentRouterState: o,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                Cn((i) => 0 !== i.id),
                Z((i) => ({
                  ...i,
                  extractedUrl: t.urlHandlingStrategy.extract(i.rawUrl),
                })),
                Tt((i) => {
                  this.currentTransition = i;
                  let s = !1,
                    a = !1;
                  return R(i).pipe(
                    Be((u) => {
                      this.currentNavigation = {
                        id: u.id,
                        initialUrl: u.rawUrl,
                        extractedUrl: u.extractedUrl,
                        trigger: u.source,
                        extras: u.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Tt((u) => {
                      const c = u.currentBrowserUrl.toString(),
                        l =
                          !t.navigated ||
                          u.extractedUrl.toString() !== c ||
                          c !== u.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (u.extras.onSameUrlNavigation ??
                            t.onSameUrlNavigation)
                      ) {
                        const f = "";
                        return (
                          this.events.next(
                            new Co(
                              u.id,
                              this.urlSerializer.serialize(u.rawUrl),
                              f,
                              0
                            )
                          ),
                          u.resolve(null),
                          Ht
                        );
                      }
                      if (t.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                        return R(u).pipe(
                          Tt((f) => {
                            const h = this.transitions?.getValue();
                            return (
                              this.events.next(
                                new yu(
                                  f.id,
                                  this.urlSerializer.serialize(f.extractedUrl),
                                  f.source,
                                  f.restoredState
                                )
                              ),
                              h !== this.transitions?.getValue()
                                ? Ht
                                : Promise.resolve(f)
                            );
                          }),
                          (function hV(e, n, t, r, o, i) {
                            return Te((s) =>
                              (function cV(e, n, t, r, o, i, s = "emptyOnly") {
                                return new lV(e, n, t, r, o, s, i).recognize();
                              })(e, n, t, r, s.extractedUrl, o, i).pipe(
                                Z(({ state: a, tree: u }) => ({
                                  ...s,
                                  targetSnapshot: a,
                                  urlAfterRedirects: u,
                                }))
                              )
                            );
                          })(
                            this.environmentInjector,
                            this.configLoader,
                            this.rootComponentType,
                            t.config,
                            this.urlSerializer,
                            t.paramsInheritanceStrategy
                          ),
                          Be((f) => {
                            (i.targetSnapshot = f.targetSnapshot),
                              (i.urlAfterRedirects = f.urlAfterRedirects),
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: f.urlAfterRedirects,
                              });
                            const h = new vw(
                              f.id,
                              this.urlSerializer.serialize(f.extractedUrl),
                              this.urlSerializer.serialize(f.urlAfterRedirects),
                              f.targetSnapshot
                            );
                            this.events.next(h);
                          })
                        );
                      if (
                        l &&
                        t.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                      ) {
                        const {
                            id: f,
                            extractedUrl: h,
                            source: p,
                            restoredState: g,
                            extras: y,
                          } = u,
                          _ = new yu(f, this.urlSerializer.serialize(h), p, g);
                        this.events.next(_);
                        const m = ww(0, this.rootComponentType).snapshot;
                        return (
                          (this.currentTransition = i =
                            {
                              ...u,
                              targetSnapshot: m,
                              urlAfterRedirects: h,
                              extras: {
                                ...y,
                                skipLocationChange: !1,
                                replaceUrl: !1,
                              },
                            }),
                          R(i)
                        );
                      }
                      {
                        const f = "";
                        return (
                          this.events.next(
                            new Co(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              f,
                              1
                            )
                          ),
                          u.resolve(null),
                          Ht
                        );
                      }
                    }),
                    Be((u) => {
                      const c = new aL(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot
                      );
                      this.events.next(c);
                    }),
                    Z(
                      (u) => (
                        (this.currentTransition = i =
                          {
                            ...u,
                            guards: xL(
                              u.targetSnapshot,
                              u.currentSnapshot,
                              this.rootContexts
                            ),
                          }),
                        i
                      )
                    ),
                    (function UL(e, n) {
                      return Te((t) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: o,
                          guards: {
                            canActivateChecks: i,
                            canDeactivateChecks: s,
                          },
                        } = t;
                        return 0 === s.length && 0 === i.length
                          ? R({ ...t, guardsResult: !0 })
                          : (function zL(e, n, t, r) {
                              return be(e).pipe(
                                Te((o) =>
                                  (function QL(e, n, t, r, o) {
                                    const i =
                                      n && n.routeConfig
                                        ? n.routeConfig.canDeactivate
                                        : null;
                                    return i && 0 !== i.length
                                      ? R(
                                          i.map((a) => {
                                            const u = Xi(n) ?? o,
                                              c = bo(a, u);
                                            return Bn(
                                              (function BL(e) {
                                                return e && es(e.canDeactivate);
                                              })(c)
                                                ? c.canDeactivate(e, n, t, r)
                                                : u.runInContext(() =>
                                                    c(e, n, t, r)
                                                  )
                                            ).pipe(ur());
                                          })
                                        ).pipe(Io())
                                      : R(!0);
                                  })(o.component, o.route, t, n, r)
                                ),
                                ur((o) => !0 !== o, !0)
                              );
                            })(s, r, o, e).pipe(
                              Te((a) =>
                                a &&
                                (function kL(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function GL(e, n, t, r) {
                                      return be(n).pipe(
                                        go((o) =>
                                          bf(
                                            (function WL(e, n) {
                                              return (
                                                null !== e && n && n(new hL(e)),
                                                R(!0)
                                              );
                                            })(o.route.parent, r),
                                            (function qL(e, n) {
                                              return (
                                                null !== e && n && n(new gL(e)),
                                                R(!0)
                                              );
                                            })(o.route, r),
                                            (function YL(e, n, t) {
                                              const r = n[n.length - 1],
                                                i = n
                                                  .slice(0, n.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function OL(e) {
                                                      const n = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return n && 0 !== n.length
                                                        ? { node: e, guards: n }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    QC(() =>
                                                      R(
                                                        s.guards.map((u) => {
                                                          const c =
                                                              Xi(s.node) ?? t,
                                                            l = bo(u, c);
                                                          return Bn(
                                                            (function jL(e) {
                                                              return (
                                                                e &&
                                                                es(
                                                                  e.canActivateChild
                                                                )
                                                              );
                                                            })(l)
                                                              ? l.canActivateChild(
                                                                  r,
                                                                  e
                                                                )
                                                              : c.runInContext(
                                                                  () => l(r, e)
                                                                )
                                                          ).pipe(ur());
                                                        })
                                                      ).pipe(Io())
                                                    )
                                                  );
                                              return R(i).pipe(Io());
                                            })(e, o.path, t),
                                            (function ZL(e, n, t) {
                                              const r = n.routeConfig
                                                ? n.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return R(!0);
                                              const o = r.map((i) =>
                                                QC(() => {
                                                  const s = Xi(n) ?? t,
                                                    a = bo(i, s);
                                                  return Bn(
                                                    (function VL(e) {
                                                      return (
                                                        e && es(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(n, e)
                                                      : s.runInContext(() =>
                                                          a(n, e)
                                                        )
                                                  ).pipe(ur());
                                                })
                                              );
                                              return R(o).pipe(Io());
                                            })(e, o.route, t)
                                          )
                                        ),
                                        ur((o) => !0 !== o, !0)
                                      );
                                    })(r, i, e, n)
                                  : R(a)
                              ),
                              Z((a) => ({ ...t, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (u) => this.events.next(u)),
                    Be((u) => {
                      if (
                        ((i.guardsResult = u.guardsResult), dr(u.guardsResult))
                      )
                        throw Sw(0, u.guardsResult);
                      const c = new uL(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                        !!u.guardsResult
                      );
                      this.events.next(c);
                    }),
                    Cn(
                      (u) =>
                        !!u.guardsResult ||
                        (this.cancelNavigationTransition(u, "", 3), !1)
                    ),
                    zf((u) => {
                      if (u.guards.canActivateChecks.length)
                        return R(u).pipe(
                          Be((c) => {
                            const l = new cL(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              this.urlSerializer.serialize(c.urlAfterRedirects),
                              c.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          Tt((c) => {
                            let l = !1;
                            return R(c).pipe(
                              (function pV(e, n) {
                                return Te((t) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: o },
                                  } = t;
                                  if (!o.length) return R(t);
                                  let i = 0;
                                  return be(o).pipe(
                                    go((s) =>
                                      (function gV(e, n, t, r) {
                                        const o = e.routeConfig,
                                          i = e._resolve;
                                        return (
                                          void 0 !== o?.title &&
                                            !Bw(o) &&
                                            (i[Hi] = o.title),
                                          (function mV(e, n, t, r) {
                                            const o = (function yV(e) {
                                              return [
                                                ...Object.keys(e),
                                                ...Object.getOwnPropertySymbols(
                                                  e
                                                ),
                                              ];
                                            })(e);
                                            if (0 === o.length) return R({});
                                            const i = {};
                                            return be(o).pipe(
                                              Te((s) =>
                                                (function vV(e, n, t, r) {
                                                  const o = Xi(n) ?? r,
                                                    i = bo(e, o);
                                                  return Bn(
                                                    i.resolve
                                                      ? i.resolve(n, t)
                                                      : o.runInContext(() =>
                                                          i(n, t)
                                                        )
                                                  );
                                                })(e[s], n, t, r).pipe(
                                                  ur(),
                                                  Be((a) => {
                                                    i[s] = a;
                                                  })
                                                )
                                              ),
                                              Mf(1),
                                              (function Rk(e) {
                                                return Z(() => e);
                                              })(i),
                                              cr((s) => (xw(s) ? Ht : Bi(s)))
                                            );
                                          })(i, e, n, r).pipe(
                                            Z(
                                              (s) => (
                                                (e._resolvedData = s),
                                                (e.data = Ew(e, t).resolve),
                                                o &&
                                                  Bw(o) &&
                                                  (e.data[Hi] = o.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, e, n)
                                    ),
                                    Be(() => i++),
                                    Mf(1),
                                    Te((s) => (i === o.length ? R(t) : Ht))
                                  );
                                });
                              })(
                                t.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              Be({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    this.cancelNavigationTransition(c, "", 2);
                                },
                              })
                            );
                          }),
                          Be((c) => {
                            const l = new lL(
                              c.id,
                              this.urlSerializer.serialize(c.extractedUrl),
                              this.urlSerializer.serialize(c.urlAfterRedirects),
                              c.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    zf((u) => {
                      const c = (l) => {
                        const d = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          d.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              Be((f) => {
                                l.component = f;
                              }),
                              Z(() => {})
                            )
                          );
                        for (const f of l.children) d.push(...c(f));
                        return d;
                      };
                      return Ef(c(u.targetSnapshot.root)).pipe(lu(), vo(1));
                    }),
                    zf(() => this.afterPreactivation()),
                    Z((u) => {
                      const c = (function CL(e, n, t) {
                        const r = Qi(e, n._root, t ? t._root : void 0);
                        return new Cw(r, n);
                      })(
                        t.routeReuseStrategy,
                        u.targetSnapshot,
                        u.currentRouterState
                      );
                      return (
                        (this.currentTransition = i =
                          { ...u, targetRouterState: c }),
                        i
                      );
                    }),
                    Be(() => {
                      this.events.next(new xf());
                    }),
                    ((e, n, t, r) =>
                      Z(
                        (o) => (
                          new RL(
                            n,
                            o.targetRouterState,
                            o.currentRouterState,
                            t,
                            r
                          ).activate(e),
                          o
                        )
                      ))(
                      this.rootContexts,
                      t.routeReuseStrategy,
                      (u) => this.events.next(u),
                      this.inputBindingEnabled
                    ),
                    vo(1),
                    Be({
                      next: (u) => {
                        (s = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          this.events.next(
                            new Hn(
                              u.id,
                              this.urlSerializer.serialize(u.extractedUrl),
                              this.urlSerializer.serialize(u.urlAfterRedirects)
                            )
                          ),
                          t.titleStrategy?.updateTitle(
                            u.targetRouterState.snapshot
                          ),
                          u.resolve(!0);
                      },
                      complete: () => {
                        s = !0;
                      },
                    }),
                    (function xk(e) {
                      return Ee((n, t) => {
                        at(e).subscribe(_e(t, () => t.complete(), Bu)),
                          !t.closed && n.subscribe(t);
                      });
                    })(
                      this.transitionAbortSubject.pipe(
                        Be((u) => {
                          throw u;
                        })
                      )
                    ),
                    Li(() => {
                      s || a || this.cancelNavigationTransition(i, "", 1),
                        this.currentNavigation?.id === i.id &&
                          (this.currentNavigation = null);
                    }),
                    cr((u) => {
                      if (((a = !0), Tw(u)))
                        this.events.next(
                          new Zi(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            u.message,
                            u.cancellationCode
                          )
                        ),
                          (function bL(e) {
                            return Tw(e) && dr(e.url);
                          })(u)
                            ? this.events.next(new Of(u.url))
                            : i.resolve(!1);
                      else {
                        this.events.next(
                          new vu(
                            i.id,
                            this.urlSerializer.serialize(i.extractedUrl),
                            u,
                            i.targetSnapshot ?? void 0
                          )
                        );
                        try {
                          i.resolve(t.errorHandler(u));
                        } catch (c) {
                          i.reject(c);
                        }
                      }
                      return Ht;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(t, r, o) {
            const i = new Zi(
              t.id,
              this.urlSerializer.serialize(t.extractedUrl),
              r,
              o
            );
            this.events.next(i), t.resolve(!1);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function $w(e) {
        return e !== Wi;
      }
      let Uw = (() => {
          class e {
            buildTitle(t) {
              let r,
                o = t.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === B));
              return r;
            }
            getResolvedTitleForRoute(t) {
              return t.data[Hi];
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: function () {
                return E(CV);
              },
              providedIn: "root",
            }));
          }
          return e;
        })(),
        CV = (() => {
          class e extends Uw {
            constructor(t) {
              super(), (this.title = t);
            }
            updateTitle(t) {
              const r = this.buildTitle(t);
              void 0 !== r && this.title.setTitle(r);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(IC));
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        wV = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: function () {
                return E(bV);
              },
              providedIn: "root",
            }));
          }
          return e;
        })();
      class EV {
        shouldDetach(n) {
          return !1;
        }
        store(n, t) {}
        shouldAttach(n) {
          return !1;
        }
        retrieve(n) {
          return null;
        }
        shouldReuseRoute(n, t) {
          return n.routeConfig === t.routeConfig;
        }
      }
      let bV = (() => {
        class e extends EV {
          static #e = (this.ɵfac = (function () {
            let t;
            return function (o) {
              return (t || (t = Pe(e)))(o || e);
            };
          })());
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const Mu = new I("", { providedIn: "root", factory: () => ({}) });
      let IV = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: function () {
                return E(MV);
              },
              providedIn: "root",
            }));
          }
          return e;
        })(),
        MV = (() => {
          class e {
            shouldProcessUrl(t) {
              return !0;
            }
            extract(t) {
              return t;
            }
            merge(t, r) {
              return t;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })();
      var ts = (function (e) {
        return (
          (e[(e.COMPLETE = 0)] = "COMPLETE"),
          (e[(e.FAILED = 1)] = "FAILED"),
          (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
          e
        );
      })(ts || {});
      function zw(e, n) {
        e.events
          .pipe(
            Cn(
              (t) =>
                t instanceof Hn ||
                t instanceof Zi ||
                t instanceof vu ||
                t instanceof Co
            ),
            Z((t) =>
              t instanceof Hn || t instanceof Co
                ? ts.COMPLETE
                : t instanceof Zi && (0 === t.code || 1 === t.code)
                ? ts.REDIRECTING
                : ts.FAILED
            ),
            Cn((t) => t !== ts.REDIRECTING),
            vo(1)
          )
          .subscribe(() => {
            n();
          });
      }
      function SV(e) {
        throw e;
      }
      function AV(e, n, t) {
        return n.parse("/");
      }
      const TV = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        NV = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let St = (() => {
        class e {
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            return "computed" !== this.canceledNavigationResolution
              ? this.currentPageId
              : this.location.getState()?.ɵrouterPageId ?? this.currentPageId;
          }
          get events() {
            return this._events;
          }
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = E(t_)),
              (this.isNgZoneEnabled = !1),
              (this._events = new At()),
              (this.options = E(Mu, { optional: !0 }) || {}),
              (this.pendingTasks = E(La)),
              (this.errorHandler = this.options.errorHandler || SV),
              (this.malformedUriErrorHandler =
                this.options.malformedUriErrorHandler || AV),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.urlHandlingStrategy = E(IV)),
              (this.routeReuseStrategy = E(wV)),
              (this.titleStrategy = E(Uw)),
              (this.onSameUrlNavigation =
                this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy =
                this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace"),
              (this.config = E(So, { optional: !0 })?.flat() ?? []),
              (this.navigationTransitions = E(Iu)),
              (this.urlSerializer = E(Ui)),
              (this.location = E(Gd)),
              (this.componentInputBindingEnabled = !!E(_u, { optional: !0 })),
              (this.eventsSubscription = new st()),
              (this.isNgZoneEnabled =
                E(ae) instanceof ae && ae.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new _o()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = ww(0, null)),
              this.navigationTransitions
                .setupNavigations(this, this.currentUrlTree, this.routerState)
                .subscribe(
                  (t) => {
                    (this.lastSuccessfulId = t.id),
                      (this.currentPageId = this.browserPageId);
                  },
                  (t) => {
                    this.console.warn(`Unhandled Navigation Error: ${t}`);
                  }
                ),
              this.subscribeToNavigationEvents();
          }
          subscribeToNavigationEvents() {
            const t = this.navigationTransitions.events.subscribe((r) => {
              try {
                const { currentTransition: o } = this.navigationTransitions;
                if (null === o) return void (Gw(r) && this._events.next(r));
                if (r instanceof yu)
                  $w(o.source) && (this.browserUrlTree = o.extractedUrl);
                else if (r instanceof Co) this.rawUrlTree = o.rawUrl;
                else if (r instanceof vw) {
                  if ("eager" === this.urlUpdateStrategy) {
                    if (!o.extras.skipLocationChange) {
                      const i = this.urlHandlingStrategy.merge(
                        o.urlAfterRedirects,
                        o.rawUrl
                      );
                      this.setBrowserUrl(i, o);
                    }
                    this.browserUrlTree = o.urlAfterRedirects;
                  }
                } else if (r instanceof xf)
                  (this.currentUrlTree = o.urlAfterRedirects),
                    (this.rawUrlTree = this.urlHandlingStrategy.merge(
                      o.urlAfterRedirects,
                      o.rawUrl
                    )),
                    (this.routerState = o.targetRouterState),
                    "deferred" === this.urlUpdateStrategy &&
                      (o.extras.skipLocationChange ||
                        this.setBrowserUrl(this.rawUrlTree, o),
                      (this.browserUrlTree = o.urlAfterRedirects));
                else if (r instanceof Zi)
                  0 !== r.code && 1 !== r.code && (this.navigated = !0),
                    (3 === r.code || 2 === r.code) && this.restoreHistory(o);
                else if (r instanceof Of) {
                  const i = this.urlHandlingStrategy.merge(
                      r.url,
                      o.currentRawUrl
                    ),
                    s = {
                      skipLocationChange: o.extras.skipLocationChange,
                      replaceUrl:
                        "eager" === this.urlUpdateStrategy || $w(o.source),
                    };
                  this.scheduleNavigation(i, Wi, null, s, {
                    resolve: o.resolve,
                    reject: o.reject,
                    promise: o.promise,
                  });
                }
                r instanceof vu && this.restoreHistory(o, !0),
                  r instanceof Hn && (this.navigated = !0),
                  Gw(r) && this._events.next(r);
              } catch (o) {
                this.navigationTransitions.transitionAbortSubject.next(o);
              }
            });
            this.eventsSubscription.add(t);
          }
          resetRootComponentType(t) {
            (this.routerState.root.component = t),
              (this.navigationTransitions.rootComponentType = t);
          }
          initialNavigation() {
            if (
              (this.setUpLocationChangeListener(),
              !this.navigationTransitions.hasRequestedNavigation)
            ) {
              const t = this.location.getState();
              this.navigateToSyncWithBrowser(this.location.path(!0), Wi, t);
            }
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((t) => {
                const r = "popstate" === t.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    this.navigateToSyncWithBrowser(t.url, r, t.state);
                  }, 0);
              }));
          }
          navigateToSyncWithBrowser(t, r, o) {
            const i = { replaceUrl: !0 },
              s = o?.navigationId ? o : null;
            if (o) {
              const u = { ...o };
              delete u.navigationId,
                delete u.ɵrouterPageId,
                0 !== Object.keys(u).length && (i.state = u);
            }
            const a = this.parseUrl(t);
            this.scheduleNavigation(a, r, s, i);
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          get lastSuccessfulNavigation() {
            return this.navigationTransitions.lastSuccessfulNavigation;
          }
          resetConfig(t) {
            (this.config = t.map(Hf)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0),
              this.eventsSubscription.unsubscribe();
          }
          createUrlTree(t, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              c = u ? this.currentUrlTree.fragment : s;
            let d,
              l = null;
            switch (a) {
              case "merge":
                l = { ...this.currentUrlTree.queryParams, ...i };
                break;
              case "preserve":
                l = this.currentUrlTree.queryParams;
                break;
              default:
                l = i || null;
            }
            null !== l && (l = this.removeEmptyProps(l));
            try {
              d = dw(o ? o.snapshot : this.routerState.snapshot.root);
            } catch {
              ("string" != typeof t[0] || !t[0].startsWith("/")) && (t = []),
                (d = this.currentUrlTree.root);
            }
            return fw(d, t, l, c ?? null);
          }
          navigateByUrl(t, r = { skipLocationChange: !1 }) {
            const o = dr(t) ? t : this.parseUrl(t),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, Wi, null, r);
          }
          navigate(t, r = { skipLocationChange: !1 }) {
            return (
              (function RV(e) {
                for (let n = 0; n < e.length; n++)
                  if (null == e[n]) throw new D(4008, !1);
              })(t),
              this.navigateByUrl(this.createUrlTree(t, r), r)
            );
          }
          serializeUrl(t) {
            return this.urlSerializer.serialize(t);
          }
          parseUrl(t) {
            let r;
            try {
              r = this.urlSerializer.parse(t);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, t);
            }
            return r;
          }
          isActive(t, r) {
            let o;
            if (((o = !0 === r ? { ...TV } : !1 === r ? { ...NV } : r), dr(t)))
              return nw(this.currentUrlTree, t, o);
            const i = this.parseUrl(t);
            return nw(this.currentUrlTree, i, o);
          }
          removeEmptyProps(t) {
            return Object.keys(t).reduce((r, o) => {
              const i = t[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          scheduleNavigation(t, r, o, i, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, u, c;
            s
              ? ((a = s.resolve), (u = s.reject), (c = s.promise))
              : (c = new Promise((d, f) => {
                  (a = d), (u = f);
                }));
            const l = this.pendingTasks.add();
            return (
              zw(this, () => {
                queueMicrotask(() => this.pendingTasks.remove(l));
              }),
              this.navigationTransitions.handleNavigationRequest({
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                currentBrowserUrl: this.browserUrlTree,
                rawUrl: t,
                extras: i,
                resolve: a,
                reject: u,
                promise: c,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              c.catch((d) => Promise.reject(d))
            );
          }
          setBrowserUrl(t, r) {
            const o = this.urlSerializer.serialize(t);
            if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
              const s = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId),
              };
              this.location.replaceState(o, "", s);
            } else {
              const i = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, this.browserPageId + 1),
              };
              this.location.go(o, "", i);
            }
          }
          restoreHistory(t, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i = this.currentPageId - this.browserPageId;
              0 !== i
                ? this.location.historyGo(i)
                : this.currentUrlTree ===
                    this.getCurrentNavigation()?.finalUrl &&
                  0 === i &&
                  (this.resetState(t),
                  (this.browserUrlTree = t.currentUrlTree),
                  this.resetUrlToCurrentUrlTree());
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(t), this.resetUrlToCurrentUrlTree());
          }
          resetState(t) {
            (this.routerState = t.currentRouterState),
              (this.currentUrlTree = t.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                t.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          generateNgRouterState(t, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: t, ɵrouterPageId: r }
              : { navigationId: t };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      function Gw(e) {
        return !(e instanceof xf || e instanceof Of);
      }
      let Su = (() => {
          class e {
            constructor(t, r, o, i, s, a) {
              (this.router = t),
                (this.route = r),
                (this.tabIndexAttribute = o),
                (this.renderer = i),
                (this.el = s),
                (this.locationStrategy = a),
                (this.href = null),
                (this.commands = null),
                (this.onChanges = new At()),
                (this.preserveFragment = !1),
                (this.skipLocationChange = !1),
                (this.replaceUrl = !1);
              const u = s.nativeElement.tagName?.toLowerCase();
              (this.isAnchorElement = "a" === u || "area" === u),
                this.isAnchorElement
                  ? (this.subscription = t.events.subscribe((c) => {
                      c instanceof Hn && this.updateHref();
                    }))
                  : this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(t) {
              null != this.tabIndexAttribute ||
                this.isAnchorElement ||
                this.applyAttributeValue("tabindex", t);
            }
            ngOnChanges(t) {
              this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this);
            }
            set routerLink(t) {
              null != t
                ? ((this.commands = Array.isArray(t) ? t : [t]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick(t, r, o, i, s) {
              return (
                !!(
                  null === this.urlTree ||
                  (this.isAnchorElement &&
                    (0 !== t ||
                      r ||
                      o ||
                      i ||
                      s ||
                      ("string" == typeof this.target &&
                        "_self" != this.target)))
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !this.isAnchorElement)
              );
            }
            ngOnDestroy() {
              this.subscription?.unsubscribe();
            }
            updateHref() {
              this.href =
                null !== this.urlTree && this.locationStrategy
                  ? this.locationStrategy?.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
              const t =
                null === this.href
                  ? null
                  : (function am(e, n, t) {
                      return (function O0(e, n) {
                        return ("src" === n &&
                          ("embed" === e ||
                            "frame" === e ||
                            "iframe" === e ||
                            "media" === e ||
                            "script" === e)) ||
                          ("href" === n && ("base" === e || "link" === e))
                          ? sm
                          : im;
                      })(
                        n,
                        t
                      )(e);
                    })(
                      this.href,
                      this.el.nativeElement.tagName.toLowerCase(),
                      "href"
                    );
              this.applyAttributeValue("href", t);
            }
            applyAttributeValue(t, r) {
              const o = this.renderer,
                i = this.el.nativeElement;
              null !== r ? o.setAttribute(i, t, r) : o.removeAttribute(i, t);
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(
                C(St),
                C(Eo),
                (function Ls(e) {
                  return (function JM(e, n) {
                    if ("class" === n) return e.classes;
                    if ("style" === n) return e.styles;
                    const t = e.attrs;
                    if (t) {
                      const r = t.length;
                      let o = 0;
                      for (; o < r; ) {
                        const i = t[o];
                        if (Kh(i)) break;
                        if (0 === i) o += 2;
                        else if ("number" == typeof i)
                          for (o++; o < r && "string" == typeof t[o]; ) o++;
                        else {
                          if (i === n) return t[o + 1];
                          o += 2;
                        }
                      }
                    }
                    return null;
                  })(Oe(), e);
                })("tabindex"),
                C(fn),
                C(ht),
                C(sr)
              );
            });
            static #t = (this.ɵdir = F({
              type: e,
              selectors: [["", "routerLink", ""]],
              hostVars: 1,
              hostBindings: function (r, o) {
                1 & r &&
                  Fe("click", function (s) {
                    return o.onClick(
                      s.button,
                      s.ctrlKey,
                      s.shiftKey,
                      s.altKey,
                      s.metaKey
                    );
                  }),
                  2 & r && Qt("target", o.target);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: ["preserveFragment", "preserveFragment", ho],
                skipLocationChange: [
                  "skipLocationChange",
                  "skipLocationChange",
                  ho,
                ],
                replaceUrl: ["replaceUrl", "replaceUrl", ho],
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [_y, Ct],
            }));
          }
          return e;
        })(),
        qw = (() => {
          class e {
            get isActive() {
              return this._isActive;
            }
            constructor(t, r, o, i, s) {
              (this.router = t),
                (this.element = r),
                (this.renderer = o),
                (this.cdr = i),
                (this.link = s),
                (this.classes = []),
                (this._isActive = !1),
                (this.routerLinkActiveOptions = { exact: !1 }),
                (this.isActiveChange = new de()),
                (this.routerEventsSubscription = t.events.subscribe((a) => {
                  a instanceof Hn && this.update();
                }));
            }
            ngAfterContentInit() {
              R(this.links.changes, R(null))
                .pipe(mr())
                .subscribe((t) => {
                  this.update(), this.subscribeToEachLinkOnChanges();
                });
            }
            subscribeToEachLinkOnChanges() {
              this.linkInputChangesSubscription?.unsubscribe();
              const t = [...this.links.toArray(), this.link]
                .filter((r) => !!r)
                .map((r) => r.onChanges);
              this.linkInputChangesSubscription = be(t)
                .pipe(mr())
                .subscribe((r) => {
                  this._isActive !== this.isLinkActive(this.router)(r) &&
                    this.update();
                });
            }
            set routerLinkActive(t) {
              const r = Array.isArray(t) ? t : t.split(" ");
              this.classes = r.filter((o) => !!o);
            }
            ngOnChanges(t) {
              this.update();
            }
            ngOnDestroy() {
              this.routerEventsSubscription.unsubscribe(),
                this.linkInputChangesSubscription?.unsubscribe();
            }
            update() {
              !this.links ||
                !this.router.navigated ||
                queueMicrotask(() => {
                  const t = this.hasActiveLinks();
                  this._isActive !== t &&
                    ((this._isActive = t),
                    this.cdr.markForCheck(),
                    this.classes.forEach((r) => {
                      t
                        ? this.renderer.addClass(this.element.nativeElement, r)
                        : this.renderer.removeClass(
                            this.element.nativeElement,
                            r
                          );
                    }),
                    t && void 0 !== this.ariaCurrentWhenActive
                      ? this.renderer.setAttribute(
                          this.element.nativeElement,
                          "aria-current",
                          this.ariaCurrentWhenActive.toString()
                        )
                      : this.renderer.removeAttribute(
                          this.element.nativeElement,
                          "aria-current"
                        ),
                    this.isActiveChange.emit(t));
                });
            }
            isLinkActive(t) {
              const r = (function xV(e) {
                return !!e.paths;
              })(this.routerLinkActiveOptions)
                ? this.routerLinkActiveOptions
                : this.routerLinkActiveOptions.exact || !1;
              return (o) => !!o.urlTree && t.isActive(o.urlTree, r);
            }
            hasActiveLinks() {
              const t = this.isLinkActive(this.router);
              return (this.link && t(this.link)) || this.links.some(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(C(St), C(ht), C(fn), C(Ha), C(Su, 8));
            });
            static #t = (this.ɵdir = F({
              type: e,
              selectors: [["", "routerLinkActive", ""]],
              contentQueries: function (r, o, i) {
                if ((1 & r && PD(i, Su, 5), 2 & r)) {
                  let s;
                  OD(
                    (s = (function FD() {
                      return (function $x(e, n) {
                        return e[Ut].queries[n].queryList;
                      })(v(), zp());
                    })())
                  ) && (o.links = s);
                }
              },
              inputs: {
                routerLinkActiveOptions: "routerLinkActiveOptions",
                ariaCurrentWhenActive: "ariaCurrentWhenActive",
                routerLinkActive: "routerLinkActive",
              },
              outputs: { isActiveChange: "isActiveChange" },
              exportAs: ["routerLinkActive"],
              standalone: !0,
              features: [Ct],
            }));
          }
          return e;
        })();
      class Ww {}
      let OV = (() => {
        class e {
          constructor(t, r, o, i, s) {
            (this.router = t),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Cn((t) => t instanceof Hn),
                go(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(t, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = hd(i.providers, t, `Route: ${i.path}`));
              const s = i._injector ?? t,
                a = i._loadedInjector ?? s;
              ((i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
                (i.loadComponent && !i._loadedComponent)) &&
                o.push(this.preloadConfig(s, i)),
                (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return be(o).pipe(mr());
          }
          preloadConfig(t, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(t, r)
                  : R(null);
              const i = o.pipe(
                Te((s) =>
                  null === s
                    ? R(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? t, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? be([i, this.loader.loadComponent(r)]).pipe(mr())
                : i;
            });
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(St), M(n_), M(ft), M(Ww), M(Gf));
          });
          static #t = (this.ɵprov = S({
            token: e,
            factory: e.ɵfac,
            providedIn: "root",
          }));
        }
        return e;
      })();
      const qf = new I("");
      let Zw = (() => {
        class e {
          constructor(t, r, o, i, s = {}) {
            (this.urlSerializer = t),
              (this.transitions = r),
              (this.viewportScroller = o),
              (this.zone = i),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof yu
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = t.navigationTrigger),
                  (this.restoredId = t.restoredState
                    ? t.restoredState.navigationId
                    : 0))
                : t instanceof Hn
                ? ((this.lastId = t.id),
                  this.scheduleScrollEvent(
                    t,
                    this.urlSerializer.parse(t.urlAfterRedirects).fragment
                  ))
                : t instanceof Co &&
                  0 === t.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    t,
                    this.urlSerializer.parse(t.url).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((t) => {
              t instanceof Dw &&
                (t.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(t.position)
                  : t.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(t.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(t, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new Dw(
                      t,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
          static #e = (this.ɵfac = function (r) {
            !(function Wm() {
              throw new Error("invalid");
            })();
          });
          static #t = (this.ɵprov = S({ token: e, factory: e.ɵfac }));
        }
        return e;
      })();
      function En(e, n) {
        return { ɵkind: e, ɵproviders: n };
      }
      function Qw() {
        const e = E(pt);
        return (n) => {
          const t = e.get(fo);
          if (n !== t.components[0]) return;
          const r = e.get(St),
            o = e.get(Xw);
          1 === e.get(Wf) && r.initialNavigation(),
            e.get(Jw, null, $.Optional)?.setUpPreloading(),
            e.get(qf, null, $.Optional)?.init(),
            r.resetRootComponentType(t.componentTypes[0]),
            o.closed || (o.next(), o.complete(), o.unsubscribe());
        };
      }
      const Xw = new I("", { factory: () => new At() }),
        Wf = new I("", { providedIn: "root", factory: () => 1 }),
        Jw = new I("");
      function LV(e) {
        return En(0, [
          { provide: Jw, useExisting: OV },
          { provide: Ww, useExisting: e },
        ]);
      }
      const Kw = new I("ROUTER_FORROOT_GUARD"),
        jV = [
          Gd,
          { provide: Ui, useClass: Sf },
          St,
          Yi,
          {
            provide: Eo,
            useFactory: function Yw(e) {
              return e.routerState.root;
            },
            deps: [St],
          },
          Gf,
          [],
        ];
      function BV() {
        return new c_("Router", St);
      }
      let eE = (() => {
        class e {
          constructor(t) {}
          static forRoot(t, r) {
            return {
              ngModule: e,
              providers: [
                jV,
                [],
                { provide: So, multi: !0, useValue: t },
                {
                  provide: Kw,
                  useFactory: zV,
                  deps: [[St, new Bs(), new Hs()]],
                },
                { provide: Mu, useValue: r || {} },
                r?.useHash
                  ? { provide: sr, useClass: bP }
                  : { provide: sr, useClass: j_ },
                {
                  provide: qf,
                  useFactory: () => {
                    const e = E(H1),
                      n = E(ae),
                      t = E(Mu),
                      r = E(Iu),
                      o = E(Ui);
                    return (
                      t.scrollOffset && e.setOffset(t.scrollOffset),
                      new Zw(o, r, e, n, t)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? LV(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: c_, multi: !0, useFactory: BV },
                r?.initialNavigation ? GV(r) : [],
                r?.bindToComponentInputs
                  ? En(8, [Mw, { provide: _u, useExisting: Mw }]).ɵproviders
                  : [],
                [
                  { provide: tE, useFactory: Qw },
                  { provide: Fd, multi: !0, useExisting: tE },
                ],
              ],
            };
          }
          static forChild(t) {
            return {
              ngModule: e,
              providers: [{ provide: So, multi: !0, useValue: t }],
            };
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(M(Kw, 8));
          });
          static #t = (this.ɵmod = et({ type: e }));
          static #n = (this.ɵinj = $e({}));
        }
        return e;
      })();
      function zV(e) {
        return "guarded";
      }
      function GV(e) {
        return [
          "disabled" === e.initialNavigation
            ? En(3, [
                {
                  provide: Sd,
                  multi: !0,
                  useFactory: () => {
                    const n = E(St);
                    return () => {
                      n.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Wf, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? En(2, [
                { provide: Wf, useValue: 0 },
                {
                  provide: Sd,
                  multi: !0,
                  deps: [pt],
                  useFactory: (n) => {
                    const t = n.get(wP, Promise.resolve());
                    return () =>
                      t.then(
                        () =>
                          new Promise((r) => {
                            const o = n.get(St),
                              i = n.get(Xw);
                            zw(o, () => {
                              r(!0);
                            }),
                              (n.get(Iu).afterPreactivation = () => (
                                r(!0), i.closed ? R(void 0) : i
                              )),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const tE = new I("");
      let nE = (() => {
          class e {
            constructor(t) {
              (this.http = t),
                (this.apiMock = "/assets/mock/db.json"),
                (this.apiUrl = "https://tepoly-de-teste.onrender.com/api");
            }
            getAllProducts() {
              return this.http.get(`${this.apiUrl}/product`);
            }
            getProductById(t) {
              return this.http.get(`${this.apiUrl}/product/${t}`);
            }
            setPurchaseDate() {
              return new Date();
            }
            AddProduct(t) {
              return (
                (t.purchaseDate =
                  this.setPurchaseDate().toLocaleString("pt-BR")),
                this.http.post(`${this.apiUrl}/new-product`, t)
              );
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(M(PC));
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        Zf = (() => {
          class e {
            constructor() {
              (this.iconName = ""),
                (this.iconTitle = ""),
                (this.labelText = ""),
                (this.iconId = "");
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = Ue({
              type: e,
              selectors: [["app-btn-icon"]],
              inputs: {
                iconName: "iconName",
                iconTitle: "iconTitle",
                labelText: "labelText",
                iconId: "iconId",
              },
              decls: 6,
              vars: 6,
              consts: [
                [1, "btn-icon__container"],
                [3, "classList", "title", "id"],
                [1, "material-symbols-outlined"],
                [1, "icon-label", 3, "for"],
              ],
              template: function (r, o) {
                1 & r &&
                  (T(0, "div", 0)(1, "button", 1)(2, "i", 2),
                  z(3),
                  N()(),
                  T(4, "label", 3),
                  z(5),
                  N()()),
                  2 & r &&
                    (K(1),
                    Ce("classList", o.iconName)("title", o.iconTitle)(
                      "id",
                      o.iconName + "-" + o.iconId
                    ),
                    K(2),
                    Ci(" ", o.iconName, " "),
                    K(1),
                    Ce("for", o.iconName + "-" + o.iconId),
                    K(1),
                    kt(o.labelText));
              },
              styles: [
                ".btn-icon__container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;flex-direction:column;padding:.25rem;border:1px solid #000}.material-symbols-outlined[_ngcontent-%COMP%]{font-size:1.5rem;padding:0;display:flex}.delete[_ngcontent-%COMP%]{color:#e2e2e2}.delete[_ngcontent-%COMP%]:hover{color:#aca5a5}.add_box[_ngcontent-%COMP%]{color:#f4be47}.add_box[_ngcontent-%COMP%]:hover{color:#a08a58}.add_box[_ngcontent-%COMP%], .delete[_ngcontent-%COMP%]{transition:.4s;background-color:transparent;border:none;cursor:pointer}.icon-label[_ngcontent-%COMP%]{cursor:pointer;color:#f3f3f3}",
              ],
            }));
          }
          return e;
        })(),
        rE = (() => {
          class e {
            transform(t) {
              return `R$ ${t.replace(/\./, ",")}`;
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵpipe = ke({
              name: "convertToBr",
              type: e,
              pure: !0,
            }));
          }
          return e;
        })(),
        oE = (() => {
          class e {
            transform(t) {
              return (
                "string" == typeof t &&
                  parseInt(t) &&
                  (this.valueNumber = parseInt(t)),
                this.valueNumber < 10 ? `0${t}` : `${t}`
              );
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵpipe = ke({
              name: "addZero",
              type: e,
              pure: !0,
            }));
          }
          return e;
        })(),
        iE = (() => {
          class e {
            constructor() {
              this.itemId = "";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = Ue({
              type: e,
              selectors: [["app-item"]],
              inputs: { product: "product", itemId: "itemId" },
              decls: 21,
              vars: 17,
              consts: [
                [1, "item__container"],
                [1, "item"],
                [
                  "iconName",
                  "add_box",
                  "labelText",
                  "Comprar",
                  "iconTitle",
                  "Comprar mais",
                  3,
                  "iconId",
                ],
              ],
              template: function (r, o) {
                1 & r &&
                  (T(0, "div", 0)(1, "p", 1),
                  z(2),
                  N(),
                  T(3, "p", 1),
                  z(4),
                  N(),
                  T(5, "p", 1),
                  z(6),
                  Ai(7, "convertToBr"),
                  N(),
                  T(8, "p", 1),
                  z(9),
                  Ai(10, "addZero"),
                  N(),
                  T(11, "p", 1),
                  z(12),
                  N(),
                  T(13, "p", 1),
                  z(14),
                  Ai(15, "date"),
                  N(),
                  T(16, "p", 1),
                  z(17),
                  Ai(18, "addZero"),
                  N(),
                  T(19, "div"),
                  bt(20, "app-btn-icon", 2),
                  N()()),
                  2 & r &&
                    (K(2),
                    kt(o.product.id),
                    K(2),
                    kt(o.product.name),
                    K(2),
                    kt(Oa(7, 8, o.product.price + "")),
                    K(3),
                    kt(Oa(10, 10, o.product.code)),
                    K(3),
                    kt(o.product.purchaseDate),
                    K(2),
                    kt(
                      (function CD(e, n, t, r) {
                        const o = e + U,
                          i = v(),
                          s = Ir(i, o);
                        return Ti(i, o)
                          ? yD(i, qe(), n, s.transform, t, r, s)
                          : s.transform(t, r);
                      })(15, 12, o.product.expirationDate, "dd/MM/yyyy")
                    ),
                    K(3),
                    kt(Oa(18, 15, o.product.stock)),
                    K(3),
                    Ce("iconId", o.itemId));
              },
              dependencies: [Zf, rC, rE, oE],
              styles: [
                ".item__container[_ngcontent-%COMP%]{width:100%;height:100%;display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;align-items:center}.item[_ngcontent-%COMP%]{padding:.5rem;display:flex;align-items:center;justify-content:center;text-align:center;height:100%;border:1px solid #000}.item[_ngcontent-%COMP%]:nth-child(2n){background-color:#cbded8}.item[_ngcontent-%COMP%]:nth-child(odd){background-color:#c7d3da;color:#0c0808}.item__container.to-expiration[_ngcontent-%COMP%] > .item[_ngcontent-%COMP%]{background-color:#ec7b7b}.item__container.item__container.low-stock[_ngcontent-%COMP%] > .item[_ngcontent-%COMP%]{background-color:#99a46a}",
              ],
            }));
          }
          return e;
        })();
      function WV(e, n) {
        if ((1 & e && (T(0, "div"), bt(1, "app-item", 6), N()), 2 & e)) {
          const t = n.$implicit,
            r = n.index;
          K(1), Ce("product", t)("itemId", r);
        }
      }
      let sE = (() => {
          class e {
            constructor(t) {
              (this.productSevice = t), (this.products = []);
            }
            ngOnInit() {
              this.getAllProducts();
            }
            getAllProducts() {
              this.productSevice
                .getAllProducts()
                .subscribe({
                  next: (t) => t.map((r) => this.products.push(r)),
                  error: (t) =>
                    console.error(`Erro ao fazer a requisi\xe7\xe3o: ${t}`),
                });
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(C(nE));
            });
            static #t = (this.ɵcmp = Ue({
              type: e,
              selectors: [["app-task"]],
              decls: 22,
              vars: 1,
              consts: [
                [1, "task__container"],
                [1, "task-title"],
                [1, "product__container"],
                [1, "product__header"],
                [1, "item", "item__header"],
                [4, "ngFor", "ngForOf"],
                [3, "product", "itemId"],
              ],
              template: function (r, o) {
                1 & r &&
                  (T(0, "div", 0)(1, "h2", 1),
                  z(2, "Produtos Cadastrados"),
                  N(),
                  T(3, "div", 2)(4, "div", 3)(5, "p", 4),
                  z(6, "Id"),
                  N(),
                  T(7, "p", 4),
                  z(8, "Nome"),
                  N(),
                  T(9, "p", 4),
                  z(10, "Pre\xe7o"),
                  N(),
                  T(11, "p", 4),
                  z(12, "C\xf3digo"),
                  N(),
                  T(13, "p", 4),
                  z(14, "Data da Compra"),
                  N(),
                  T(15, "p", 4),
                  z(16, "Vencimento"),
                  N(),
                  T(17, "p", 4),
                  z(18, "Estoque"),
                  N(),
                  T(19, "p", 4),
                  z(20, "A\xe7\xe3o"),
                  N()(),
                  io(21, WV, 2, 2, "div", 5),
                  N()()),
                  2 & r && (K(21), Ce("ngForOf", o.products));
              },
              dependencies: [J_, iE],
              styles: [
                ".task__container[_ngcontent-%COMP%]{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}.task-title[_ngcontent-%COMP%]{margin:1rem 0}.product__container[_ngcontent-%COMP%]{background-color:#373a87}.product__header[_ngcontent-%COMP%]{display:grid;align-items:center;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;border:1px solid #000;border-bottom:none}.item.item__header[_ngcontent-%COMP%]{background-color:#43436b;height:100%;color:#f3f3f3;font-size:1.1rem;font-weight:500}.item[_ngcontent-%COMP%]{padding:.5rem;display:flex;align-items:center;justify-content:center;text-align:center;height:100%;border:1px solid #000}",
              ],
            }));
          }
          return e;
        })(),
        ZV = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = Ue({
              type: e,
              selectors: [["app-home"]],
              decls: 4,
              vars: 0,
              consts: [
                [1, "home__container"],
                [1, "home__title"],
              ],
              template: function (r, o) {
                1 & r &&
                  (T(0, "div", 0)(1, "h1", 1),
                  z(2, "Gerenciador de Produtos"),
                  N(),
                  bt(3, "app-task"),
                  N());
              },
              dependencies: [sE],
              styles: [
                ".home__container[_ngcontent-%COMP%]{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}.home__title[_ngcontent-%COMP%]{margin-bottom:1.5rem}",
              ],
            }));
          }
          return e;
        })(),
        aE = (() => {
          class e {
            constructor(t, r) {
              (this._renderer = t),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(t, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, t, r);
            }
            registerOnTouched(t) {
              this.onTouched = t;
            }
            registerOnChange(t) {
              this.onChange = t;
            }
            setDisabledState(t) {
              this.setProperty("disabled", t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(C(fn), C(ht));
            });
            static #t = (this.ɵdir = F({ type: e }));
          }
          return e;
        })(),
        fr = (() => {
          class e extends aE {
            static #e = (this.ɵfac = (function () {
              let t;
              return function (o) {
                return (t || (t = Pe(e)))(o || e);
              };
            })());
            static #t = (this.ɵdir = F({ type: e, features: [ee] }));
          }
          return e;
        })();
      const nn = new I("NgValueAccessor"),
        XV = { provide: nn, useExisting: oe(() => Au), multi: !0 },
        KV = new I("CompositionEventMode");
      let Au = (() => {
        class e extends aE {
          constructor(t, r, o) {
            super(t, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function JV() {
                  const e = kn() ? kn().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(t) {
            this.setProperty("value", t ?? "");
          }
          _handleInput(t) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(t);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(t) {
            (this._composing = !1), this._compositionMode && this.onChange(t);
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)(C(fn), C(ht), C(KV, 8));
          });
          static #t = (this.ɵdir = F({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (r, o) {
              1 & r &&
                Fe("input", function (s) {
                  return o._handleInput(s.target.value);
                })("blur", function () {
                  return o.onTouched();
                })("compositionstart", function () {
                  return o._compositionStart();
                })("compositionend", function (s) {
                  return o._compositionEnd(s.target.value);
                });
            },
            features: [fe([XV]), ee],
          }));
        }
        return e;
      })();
      function $n(e) {
        return (
          null == e ||
          (("string" == typeof e || Array.isArray(e)) && 0 === e.length)
        );
      }
      function cE(e) {
        return null != e && "number" == typeof e.length;
      }
      const He = new I("NgValidators"),
        Un = new I("NgAsyncValidators"),
        ej =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class ns {
        static min(n) {
          return (function lE(e) {
            return (n) => {
              if ($n(n.value) || $n(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t < e
                ? { min: { min: e, actual: n.value } }
                : null;
            };
          })(n);
        }
        static max(n) {
          return (function dE(e) {
            return (n) => {
              if ($n(n.value) || $n(e)) return null;
              const t = parseFloat(n.value);
              return !isNaN(t) && t > e
                ? { max: { max: e, actual: n.value } }
                : null;
            };
          })(n);
        }
        static required(n) {
          return (function fE(e) {
            return $n(e.value) ? { required: !0 } : null;
          })(n);
        }
        static requiredTrue(n) {
          return (function hE(e) {
            return !0 === e.value ? null : { required: !0 };
          })(n);
        }
        static email(n) {
          return (function pE(e) {
            return $n(e.value) || ej.test(e.value) ? null : { email: !0 };
          })(n);
        }
        static minLength(n) {
          return (function gE(e) {
            return (n) =>
              $n(n.value) || !cE(n.value)
                ? null
                : n.value.length < e
                ? {
                    minlength: {
                      requiredLength: e,
                      actualLength: n.value.length,
                    },
                  }
                : null;
          })(n);
        }
        static maxLength(n) {
          return (function mE(e) {
            return (n) =>
              cE(n.value) && n.value.length > e
                ? {
                    maxlength: {
                      requiredLength: e,
                      actualLength: n.value.length,
                    },
                  }
                : null;
          })(n);
        }
        static pattern(n) {
          return (function yE(e) {
            if (!e) return Tu;
            let n, t;
            return (
              "string" == typeof e
                ? ((t = ""),
                  "^" !== e.charAt(0) && (t += "^"),
                  (t += e),
                  "$" !== e.charAt(e.length - 1) && (t += "$"),
                  (n = new RegExp(t)))
                : ((t = e.toString()), (n = e)),
              (r) => {
                if ($n(r.value)) return null;
                const o = r.value;
                return n.test(o)
                  ? null
                  : { pattern: { requiredPattern: t, actualValue: o } };
              }
            );
          })(n);
        }
        static nullValidator(n) {
          return null;
        }
        static compose(n) {
          return EE(n);
        }
        static composeAsync(n) {
          return bE(n);
        }
      }
      function Tu(e) {
        return null;
      }
      function vE(e) {
        return null != e;
      }
      function DE(e) {
        return Di(e) ? be(e) : e;
      }
      function _E(e) {
        let n = {};
        return (
          e.forEach((t) => {
            n = null != t ? { ...n, ...t } : n;
          }),
          0 === Object.keys(n).length ? null : n
        );
      }
      function CE(e, n) {
        return n.map((t) => t(e));
      }
      function wE(e) {
        return e.map((n) =>
          (function tj(e) {
            return !e.validate;
          })(n)
            ? n
            : (t) => n.validate(t)
        );
      }
      function EE(e) {
        if (!e) return null;
        const n = e.filter(vE);
        return 0 == n.length
          ? null
          : function (t) {
              return _E(CE(t, n));
            };
      }
      function Yf(e) {
        return null != e ? EE(wE(e)) : null;
      }
      function bE(e) {
        if (!e) return null;
        const n = e.filter(vE);
        return 0 == n.length
          ? null
          : function (t) {
              return (function YV(...e) {
                const n = Lh(e),
                  { args: t, keys: r } = qC(e),
                  o = new me((i) => {
                    const { length: s } = t;
                    if (!s) return void i.complete();
                    const a = new Array(s);
                    let u = s,
                      c = s;
                    for (let l = 0; l < s; l++) {
                      let d = !1;
                      at(t[l]).subscribe(
                        _e(
                          i,
                          (f) => {
                            d || ((d = !0), c--), (a[l] = f);
                          },
                          () => u--,
                          void 0,
                          () => {
                            (!u || !d) &&
                              (c || i.next(r ? ZC(r, a) : a), i.complete());
                          }
                        )
                      );
                    }
                  });
                return n ? o.pipe(WC(n)) : o;
              })(CE(t, n).map(DE)).pipe(Z(_E));
            };
      }
      function Qf(e) {
        return null != e ? bE(wE(e)) : null;
      }
      function IE(e, n) {
        return null === e ? [n] : Array.isArray(e) ? [...e, n] : [e, n];
      }
      function ME(e) {
        return e._rawValidators;
      }
      function SE(e) {
        return e._rawAsyncValidators;
      }
      function Xf(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function Nu(e, n) {
        return Array.isArray(e) ? e.includes(n) : e === n;
      }
      function AE(e, n) {
        const t = Xf(n);
        return (
          Xf(e).forEach((o) => {
            Nu(t, o) || t.push(o);
          }),
          t
        );
      }
      function TE(e, n) {
        return Xf(n).filter((t) => !Nu(e, t));
      }
      class NE {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(n) {
          (this._rawValidators = n || []),
            (this._composedValidatorFn = Yf(this._rawValidators));
        }
        _setAsyncValidators(n) {
          (this._rawAsyncValidators = n || []),
            (this._composedAsyncValidatorFn = Qf(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(n) {
          this._onDestroyCallbacks.push(n);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((n) => n()),
            (this._onDestroyCallbacks = []);
        }
        reset(n = void 0) {
          this.control && this.control.reset(n);
        }
        hasError(n, t) {
          return !!this.control && this.control.hasError(n, t);
        }
        getError(n, t) {
          return this.control ? this.control.getError(n, t) : null;
        }
      }
      class Je extends NE {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class zn extends NE {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class RE {
        constructor(n) {
          this._cd = n;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let xE = (() => {
          class e extends RE {
            constructor(t) {
              super(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(C(zn, 2));
            });
            static #t = (this.ɵdir = F({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (r, o) {
                2 & r &&
                  Sa("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                    "ng-pristine",
                    o.isPristine
                  )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                    "ng-invalid",
                    o.isInvalid
                  )("ng-pending", o.isPending);
              },
              features: [ee],
            }));
          }
          return e;
        })(),
        OE = (() => {
          class e extends RE {
            constructor(t) {
              super(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(C(Je, 10));
            });
            static #t = (this.ɵdir = F({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (r, o) {
                2 & r &&
                  Sa("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                    "ng-pristine",
                    o.isPristine
                  )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                    "ng-invalid",
                    o.isInvalid
                  )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
              },
              features: [ee],
            }));
          }
          return e;
        })();
      const rs = "VALID",
        xu = "INVALID",
        Ao = "PENDING",
        os = "DISABLED";
      function eh(e) {
        return (Ou(e) ? e.validators : e) || null;
      }
      function th(e, n) {
        return (Ou(n) ? n.asyncValidators : e) || null;
      }
      function Ou(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      function FE(e, n, t) {
        const r = e.controls;
        if (!(n ? Object.keys(r) : r).length) throw new D(1e3, "");
        if (!r[t]) throw new D(1001, "");
      }
      function kE(e, n, t) {
        e._forEachChild((r, o) => {
          if (void 0 === t[o]) throw new D(1002, "");
        });
      }
      class Pu {
        constructor(n, t) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(n),
            this._assignAsyncValidators(t);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(n) {
          this._rawValidators = this._composedValidatorFn = n;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(n) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = n;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === rs;
        }
        get invalid() {
          return this.status === xu;
        }
        get pending() {
          return this.status == Ao;
        }
        get disabled() {
          return this.status === os;
        }
        get enabled() {
          return this.status !== os;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(n) {
          this._assignValidators(n);
        }
        setAsyncValidators(n) {
          this._assignAsyncValidators(n);
        }
        addValidators(n) {
          this.setValidators(AE(n, this._rawValidators));
        }
        addAsyncValidators(n) {
          this.setAsyncValidators(AE(n, this._rawAsyncValidators));
        }
        removeValidators(n) {
          this.setValidators(TE(n, this._rawValidators));
        }
        removeAsyncValidators(n) {
          this.setAsyncValidators(TE(n, this._rawAsyncValidators));
        }
        hasValidator(n) {
          return Nu(this._rawValidators, n);
        }
        hasAsyncValidator(n) {
          return Nu(this._rawAsyncValidators, n);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(n = {}) {
          (this.touched = !0),
            this._parent && !n.onlySelf && this._parent.markAsTouched(n);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((n) => n.markAllAsTouched());
        }
        markAsUntouched(n = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((t) => {
              t.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        markAsDirty(n = {}) {
          (this.pristine = !1),
            this._parent && !n.onlySelf && this._parent.markAsDirty(n);
        }
        markAsPristine(n = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((t) => {
              t.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        markAsPending(n = {}) {
          (this.status = Ao),
            !1 !== n.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !n.onlySelf && this._parent.markAsPending(n);
        }
        disable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = os),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...n, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== n.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(n = {}) {
          const t = this._parentMarkedDirty(n.onlySelf);
          (this.status = rs),
            this._forEachChild((r) => {
              r.enable({ ...n, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: n.emitEvent,
            }),
            this._updateAncestors({ ...n, skipPristineCheck: t }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(n) {
          this._parent &&
            !n.onlySelf &&
            (this._parent.updateValueAndValidity(n),
            n.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(n) {
          this._parent = n;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(n = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === rs || this.status === Ao) &&
                this._runAsyncValidator(n.emitEvent)),
            !1 !== n.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !n.onlySelf &&
              this._parent.updateValueAndValidity(n);
        }
        _updateTreeValidity(n = { emitEvent: !0 }) {
          this._forEachChild((t) => t._updateTreeValidity(n)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? os : rs;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(n) {
          if (this.asyncValidator) {
            (this.status = Ao), (this._hasOwnPendingAsyncValidator = !0);
            const t = DE(this.asyncValidator(this));
            this._asyncValidationSubscription = t.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: n });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(n, t = {}) {
          (this.errors = n), this._updateControlsErrors(!1 !== t.emitEvent);
        }
        get(n) {
          let t = n;
          return null == t ||
            (Array.isArray(t) || (t = t.split(".")), 0 === t.length)
            ? null
            : t.reduce((r, o) => r && r._find(o), this);
        }
        getError(n, t) {
          const r = t ? this.get(t) : this;
          return r && r.errors ? r.errors[n] : null;
        }
        hasError(n, t) {
          return !!this.getError(n, t);
        }
        get root() {
          let n = this;
          for (; n._parent; ) n = n._parent;
          return n;
        }
        _updateControlsErrors(n) {
          (this.status = this._calculateStatus()),
            n && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(n);
        }
        _initObservables() {
          (this.valueChanges = new de()), (this.statusChanges = new de());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? os
            : this.errors
            ? xu
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Ao)
            ? Ao
            : this._anyControlsHaveStatus(xu)
            ? xu
            : rs;
        }
        _anyControlsHaveStatus(n) {
          return this._anyControls((t) => t.status === n);
        }
        _anyControlsDirty() {
          return this._anyControls((n) => n.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((n) => n.touched);
        }
        _updatePristine(n = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !n.onlySelf && this._parent._updatePristine(n);
        }
        _updateTouched(n = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !n.onlySelf && this._parent._updateTouched(n);
        }
        _registerOnCollectionChange(n) {
          this._onCollectionChange = n;
        }
        _setUpdateStrategy(n) {
          Ou(n) && null != n.updateOn && (this._updateOn = n.updateOn);
        }
        _parentMarkedDirty(n) {
          return (
            !n &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(n) {
          return null;
        }
        _assignValidators(n) {
          (this._rawValidators = Array.isArray(n) ? n.slice() : n),
            (this._composedValidatorFn = (function ij(e) {
              return Array.isArray(e) ? Yf(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(n) {
          (this._rawAsyncValidators = Array.isArray(n) ? n.slice() : n),
            (this._composedAsyncValidatorFn = (function sj(e) {
              return Array.isArray(e) ? Qf(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      class is extends Pu {
        constructor(n, t, r) {
          super(eh(t), th(r, t)),
            (this.controls = n),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(n, t) {
          return this.controls[n]
            ? this.controls[n]
            : ((this.controls[n] = t),
              t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange),
              t);
        }
        addControl(n, t, r = {}) {
          this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(n, t = {}) {
          this.controls[n] &&
            this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        setControl(n, t, r = {}) {
          this.controls[n] &&
            this.controls[n]._registerOnCollectionChange(() => {}),
            delete this.controls[n],
            t && this.registerControl(n, t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(n) {
          return this.controls.hasOwnProperty(n) && this.controls[n].enabled;
        }
        setValue(n, t = {}) {
          kE(this, 0, n),
            Object.keys(n).forEach((r) => {
              FE(this, !0, r),
                this.controls[r].setValue(n[r], {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (Object.keys(n).forEach((r) => {
              const o = this.controls[r];
              o && o.patchValue(n[r], { onlySelf: !0, emitEvent: t.emitEvent });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = {}, t = {}) {
          this._forEachChild((r, o) => {
            r.reset(n ? n[o] : null, { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (n, t, r) => ((n[r] = t.getRawValue()), n)
          );
        }
        _syncPendingControls() {
          let n = this._reduceChildren(
            !1,
            (t, r) => !!r._syncPendingControls() || t
          );
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          Object.keys(this.controls).forEach((t) => {
            const r = this.controls[t];
            r && n(r, t);
          });
        }
        _setUpControls() {
          this._forEachChild((n) => {
            n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(n) {
          for (const [t, r] of Object.entries(this.controls))
            if (this.contains(t) && n(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (t, r, o) => ((r.enabled || this.disabled) && (t[o] = r.value), t)
          );
        }
        _reduceChildren(n, t) {
          let r = n;
          return (
            this._forEachChild((o, i) => {
              r = t(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const n of Object.keys(this.controls))
            if (this.controls[n].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(n) {
          return this.controls.hasOwnProperty(n) ? this.controls[n] : null;
        }
      }
      class LE extends is {}
      const hr = new I("CallSetDisabledState", {
          providedIn: "root",
          factory: () => ss,
        }),
        ss = "always";
      function as(e, n, t = ss) {
        nh(e, n),
          n.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === t) &&
            n.valueAccessor.setDisabledState?.(e.disabled),
          (function uj(e, n) {
            n.valueAccessor.registerOnChange((t) => {
              (e._pendingValue = t),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && VE(e, n);
            });
          })(e, n),
          (function lj(e, n) {
            const t = (r, o) => {
              n.valueAccessor.writeValue(r), o && n.viewToModelUpdate(r);
            };
            e.registerOnChange(t),
              n._registerOnDestroy(() => {
                e._unregisterOnChange(t);
              });
          })(e, n),
          (function cj(e, n) {
            n.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && VE(e, n),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, n),
          (function aj(e, n) {
            if (n.valueAccessor.setDisabledState) {
              const t = (r) => {
                n.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(t),
                n._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(t);
                });
            }
          })(e, n);
      }
      function ku(e, n, t = !0) {
        const r = () => {};
        n.valueAccessor &&
          (n.valueAccessor.registerOnChange(r),
          n.valueAccessor.registerOnTouched(r)),
          Vu(e, n),
          e &&
            (n._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => {}));
      }
      function Lu(e, n) {
        e.forEach((t) => {
          t.registerOnValidatorChange && t.registerOnValidatorChange(n);
        });
      }
      function nh(e, n) {
        const t = ME(e);
        null !== n.validator
          ? e.setValidators(IE(t, n.validator))
          : "function" == typeof t && e.setValidators([t]);
        const r = SE(e);
        null !== n.asyncValidator
          ? e.setAsyncValidators(IE(r, n.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const o = () => e.updateValueAndValidity();
        Lu(n._rawValidators, o), Lu(n._rawAsyncValidators, o);
      }
      function Vu(e, n) {
        let t = !1;
        if (null !== e) {
          if (null !== n.validator) {
            const o = ME(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== n.validator);
              i.length !== o.length && ((t = !0), e.setValidators(i));
            }
          }
          if (null !== n.asyncValidator) {
            const o = SE(e);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== n.asyncValidator);
              i.length !== o.length && ((t = !0), e.setAsyncValidators(i));
            }
          }
        }
        const r = () => {};
        return Lu(n._rawValidators, r), Lu(n._rawAsyncValidators, r), t;
      }
      function VE(e, n) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          n.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function HE(e, n) {
        const t = e.indexOf(n);
        t > -1 && e.splice(t, 1);
      }
      function $E(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const cs = class extends Pu {
        constructor(n = null, t, r) {
          super(eh(t), th(r, t)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(n),
            this._setUpdateStrategy(t),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            Ou(t) &&
              (t.nonNullable || t.initialValueIsDefault) &&
              (this.defaultValue = $E(n) ? n.value : n);
        }
        setValue(n, t = {}) {
          (this.value = this._pendingValue = n),
            this._onChange.length &&
              !1 !== t.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== t.emitViewToModelChange)
              ),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          this.setValue(n, t);
        }
        reset(n = this.defaultValue, t = {}) {
          this._applyFormState(n),
            this.markAsPristine(t),
            this.markAsUntouched(t),
            this.setValue(this.value, t),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(n) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(n) {
          this._onChange.push(n);
        }
        _unregisterOnChange(n) {
          HE(this._onChange, n);
        }
        registerOnDisabledChange(n) {
          this._onDisabledChange.push(n);
        }
        _unregisterOnDisabledChange(n) {
          HE(this._onDisabledChange, n);
        }
        _forEachChild(n) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(n) {
          $E(n)
            ? ((this.value = this._pendingValue = n.value),
              n.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = n);
        }
      };
      let WE = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵdir = F({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            }));
          }
          return e;
        })(),
        YE = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({}));
          }
          return e;
        })();
      const ah = new I("NgModelWithFormControlWarning"),
        Ej = { provide: zn, useExisting: oe(() => uh) };
      let uh = (() => {
        class e extends zn {
          set isDisabled(t) {}
          static #e = (this._ngModelWarningSentOnce = !1);
          constructor(t, r, o, i, s) {
            super(),
              (this._ngModelWarningConfig = i),
              (this.callSetDisabledState = s),
              (this.update = new de()),
              (this._ngModelWarningSent = !1),
              this._setValidators(t),
              this._setAsyncValidators(r),
              (this.valueAccessor = (function ih(e, n) {
                if (!n) return null;
                let t, r, o;
                return (
                  Array.isArray(n),
                  n.forEach((i) => {
                    i.constructor === Au
                      ? (t = i)
                      : (function hj(e) {
                          return Object.getPrototypeOf(e.constructor) === fr;
                        })(i)
                      ? (r = i)
                      : (o = i);
                  }),
                  o || r || t || null
                );
              })(0, o));
          }
          ngOnChanges(t) {
            if (this._isControlChanged(t)) {
              const r = t.form.previousValue;
              r && ku(r, this, !1),
                as(this.form, this, this.callSetDisabledState),
                this.form.updateValueAndValidity({ emitEvent: !1 });
            }
            (function oh(e, n) {
              if (!e.hasOwnProperty("model")) return !1;
              const t = e.model;
              return !!t.isFirstChange() || !Object.is(n, t.currentValue);
            })(t, this.viewModel) &&
              (this.form.setValue(this.model), (this.viewModel = this.model));
          }
          ngOnDestroy() {
            this.form && ku(this.form, this, !1);
          }
          get path() {
            return [];
          }
          get control() {
            return this.form;
          }
          viewToModelUpdate(t) {
            (this.viewModel = t), this.update.emit(t);
          }
          _isControlChanged(t) {
            return t.hasOwnProperty("form");
          }
          static #t = (this.ɵfac = function (r) {
            return new (r || e)(
              C(He, 10),
              C(Un, 10),
              C(nn, 10),
              C(ah, 8),
              C(hr, 8)
            );
          });
          static #n = (this.ɵdir = F({
            type: e,
            selectors: [["", "formControl", ""]],
            inputs: {
              form: ["formControl", "form"],
              isDisabled: ["disabled", "isDisabled"],
              model: ["ngModel", "model"],
            },
            outputs: { update: "ngModelChange" },
            exportAs: ["ngForm"],
            features: [fe([Ej]), ee, Ct],
          }));
        }
        return e;
      })();
      const bj = { provide: Je, useExisting: oe(() => ju) };
      let ju = (() => {
          class e extends Je {
            constructor(t, r, o) {
              super(),
                (this.callSetDisabledState = o),
                (this.submitted = !1),
                (this._onCollectionChange = () => this._updateDomValue()),
                (this.directives = []),
                (this.form = null),
                (this.ngSubmit = new de()),
                this._setValidators(t),
                this._setAsyncValidators(r);
            }
            ngOnChanges(t) {
              this._checkFormPresent(),
                t.hasOwnProperty("form") &&
                  (this._updateValidators(),
                  this._updateDomValue(),
                  this._updateRegistrations(),
                  (this._oldForm = this.form));
            }
            ngOnDestroy() {
              this.form &&
                (Vu(this.form, this),
                this.form._onCollectionChange === this._onCollectionChange &&
                  this.form._registerOnCollectionChange(() => {}));
            }
            get formDirective() {
              return this;
            }
            get control() {
              return this.form;
            }
            get path() {
              return [];
            }
            addControl(t) {
              const r = this.form.get(t.path);
              return (
                as(r, t, this.callSetDisabledState),
                r.updateValueAndValidity({ emitEvent: !1 }),
                this.directives.push(t),
                r
              );
            }
            getControl(t) {
              return this.form.get(t.path);
            }
            removeControl(t) {
              ku(t.control || null, t, !1),
                (function pj(e, n) {
                  const t = e.indexOf(n);
                  t > -1 && e.splice(t, 1);
                })(this.directives, t);
            }
            addFormGroup(t) {
              this._setUpFormContainer(t);
            }
            removeFormGroup(t) {
              this._cleanUpFormContainer(t);
            }
            getFormGroup(t) {
              return this.form.get(t.path);
            }
            addFormArray(t) {
              this._setUpFormContainer(t);
            }
            removeFormArray(t) {
              this._cleanUpFormContainer(t);
            }
            getFormArray(t) {
              return this.form.get(t.path);
            }
            updateModel(t, r) {
              this.form.get(t.path).setValue(r);
            }
            onSubmit(t) {
              return (
                (this.submitted = !0),
                (function BE(e, n) {
                  e._syncPendingControls(),
                    n.forEach((t) => {
                      const r = t.control;
                      "submit" === r.updateOn &&
                        r._pendingChange &&
                        (t.viewToModelUpdate(r._pendingValue),
                        (r._pendingChange = !1));
                    });
                })(this.form, this.directives),
                this.ngSubmit.emit(t),
                "dialog" === t?.target?.method
              );
            }
            onReset() {
              this.resetForm();
            }
            resetForm(t = void 0) {
              this.form.reset(t), (this.submitted = !1);
            }
            _updateDomValue() {
              this.directives.forEach((t) => {
                const r = t.control,
                  o = this.form.get(t.path);
                r !== o &&
                  (ku(r || null, t),
                  ((e) => e instanceof cs)(o) &&
                    (as(o, t, this.callSetDisabledState), (t.control = o)));
              }),
                this.form._updateTreeValidity({ emitEvent: !1 });
            }
            _setUpFormContainer(t) {
              const r = this.form.get(t.path);
              (function jE(e, n) {
                nh(e, n);
              })(r, t),
                r.updateValueAndValidity({ emitEvent: !1 });
            }
            _cleanUpFormContainer(t) {
              if (this.form) {
                const r = this.form.get(t.path);
                r &&
                  (function dj(e, n) {
                    return Vu(e, n);
                  })(r, t) &&
                  r.updateValueAndValidity({ emitEvent: !1 });
              }
            }
            _updateRegistrations() {
              this.form._registerOnCollectionChange(this._onCollectionChange),
                this._oldForm &&
                  this._oldForm._registerOnCollectionChange(() => {});
            }
            _updateValidators() {
              nh(this.form, this), this._oldForm && Vu(this._oldForm, this);
            }
            _checkFormPresent() {}
            static #e = (this.ɵfac = function (r) {
              return new (r || e)(C(He, 10), C(Un, 10), C(hr, 8));
            });
            static #t = (this.ɵdir = F({
              type: e,
              selectors: [["", "formGroup", ""]],
              hostBindings: function (r, o) {
                1 & r &&
                  Fe("submit", function (s) {
                    return o.onSubmit(s);
                  })("reset", function () {
                    return o.onReset();
                  });
              },
              inputs: { form: ["formGroup", "form"] },
              outputs: { ngSubmit: "ngSubmit" },
              exportAs: ["ngForm"],
              features: [fe([bj]), ee, Ct],
            }));
          }
          return e;
        })(),
        db = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({ imports: [YE] }));
          }
          return e;
        })();
      class fb extends Pu {
        constructor(n, t, r) {
          super(eh(t), th(r, t)),
            (this.controls = n),
            this._initObservables(),
            this._setUpdateStrategy(t),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(n) {
          return this.controls[this._adjustIndex(n)];
        }
        push(n, t = {}) {
          this.controls.push(n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }),
            this._onCollectionChange();
        }
        insert(n, t, r = {}) {
          this.controls.splice(n, 0, t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(n, t = {}) {
          let r = this._adjustIndex(n);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: t.emitEvent });
        }
        setControl(n, t, r = {}) {
          let o = this._adjustIndex(n);
          o < 0 && (o = 0),
            this.controls[o] &&
              this.controls[o]._registerOnCollectionChange(() => {}),
            this.controls.splice(o, 1),
            t && (this.controls.splice(o, 0, t), this._registerControl(t)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(n, t = {}) {
          kE(this, 0, n),
            n.forEach((r, o) => {
              FE(this, !1, o),
                this.at(o).setValue(r, {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t);
        }
        patchValue(n, t = {}) {
          null != n &&
            (n.forEach((r, o) => {
              this.at(o) &&
                this.at(o).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: t.emitEvent,
                });
            }),
            this.updateValueAndValidity(t));
        }
        reset(n = [], t = {}) {
          this._forEachChild((r, o) => {
            r.reset(n[o], { onlySelf: !0, emitEvent: t.emitEvent });
          }),
            this._updatePristine(t),
            this._updateTouched(t),
            this.updateValueAndValidity(t);
        }
        getRawValue() {
          return this.controls.map((n) => n.getRawValue());
        }
        clear(n = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((t) => t._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }));
        }
        _adjustIndex(n) {
          return n < 0 ? n + this.length : n;
        }
        _syncPendingControls() {
          let n = this.controls.reduce(
            (t, r) => !!r._syncPendingControls() || t,
            !1
          );
          return n && this.updateValueAndValidity({ onlySelf: !0 }), n;
        }
        _forEachChild(n) {
          this.controls.forEach((t, r) => {
            n(t, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((n) => n.enabled || this.disabled)
            .map((n) => n.value);
        }
        _anyControls(n) {
          return this.controls.some((t) => t.enabled && n(t));
        }
        _setUpControls() {
          this._forEachChild((n) => this._registerControl(n));
        }
        _allControlsDisabled() {
          for (const n of this.controls) if (n.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(n) {
          n.setParent(this),
            n._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(n) {
          return this.at(n) ?? null;
        }
      }
      function hb(e) {
        return (
          !!e &&
          (void 0 !== e.asyncValidators ||
            void 0 !== e.validators ||
            void 0 !== e.updateOn)
        );
      }
      let $j = (() => {
          class e {
            constructor() {
              this.useNonNullable = !1;
            }
            get nonNullable() {
              const t = new e();
              return (t.useNonNullable = !0), t;
            }
            group(t, r = null) {
              const o = this._reduceControls(t);
              let i = {};
              return (
                hb(r)
                  ? (i = r)
                  : null !== r &&
                    ((i.validators = r.validator),
                    (i.asyncValidators = r.asyncValidator)),
                new is(o, i)
              );
            }
            record(t, r = null) {
              const o = this._reduceControls(t);
              return new LE(o, r);
            }
            control(t, r, o) {
              let i = {};
              return this.useNonNullable
                ? (hb(r)
                    ? (i = r)
                    : ((i.validators = r), (i.asyncValidators = o)),
                  new cs(t, { ...i, nonNullable: !0 }))
                : new cs(t, r, o);
            }
            array(t, r, o) {
              const i = t.map((s) => this._createControl(s));
              return new fb(i, r, o);
            }
            _reduceControls(t) {
              const r = {};
              return (
                Object.keys(t).forEach((o) => {
                  r[o] = this._createControl(t[o]);
                }),
                r
              );
            }
            _createControl(t) {
              return t instanceof cs || t instanceof Pu
                ? t
                : Array.isArray(t)
                ? this.control(
                    t[0],
                    t.length > 1 ? t[1] : null,
                    t.length > 2 ? t[2] : null
                  )
                : this.control(t);
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵprov = S({
              token: e,
              factory: e.ɵfac,
              providedIn: "root",
            }));
          }
          return e;
        })(),
        Uj = (() => {
          class e {
            static withConfig(t) {
              return {
                ngModule: e,
                providers: [
                  { provide: hr, useValue: t.callSetDisabledState ?? ss },
                ],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({ imports: [db] }));
          }
          return e;
        })(),
        pb = (() => {
          class e {
            static withConfig(t) {
              return {
                ngModule: e,
                providers: [
                  {
                    provide: ah,
                    useValue: t.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: hr, useValue: t.callSetDisabledState ?? ss },
                ],
              };
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({ imports: [db] }));
          }
          return e;
        })(),
        gb = (() => {
          class e {
            constructor() {
              this.submitEmmiter = new de();
            }
            onSubmit() {
              this.submitEmmiter.emit();
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = Ue({
              type: e,
              selectors: [["app-button"]],
              outputs: { submitEmmiter: "submitEmmiter" },
              decls: 2,
              vars: 0,
              consts: [["type", "submit", 1, "btn__submit", 3, "click"]],
              template: function (r, o) {
                1 & r &&
                  (T(0, "button", 0),
                  Fe("click", function () {
                    return o.onSubmit();
                  }),
                  z(1, " Enviar\n"),
                  N());
              },
              styles: [
                ".btn__submit[_ngcontent-%COMP%]{width:100%;height:100%;border:none;outline:none;padding:1rem 1.5em;font-size:1.05rem;border-radius:2rem;margin-top:1rem;background-color:var(--tertiary-color);color:var(--secondary-color);font-weight:600;transition-duration:.4s;cursor:pointer}.btn__submit[_ngcontent-%COMP%]:hover{background-color:var(--secondary-color);color:var(--tertiary-color)}",
              ],
            }));
          }
          return e;
        })();
      function Gj(e, n) {
        1 & e && (T(0, "small"), z(1, " Campo Obrigat\xf3rio "), N());
      }
      function qj(e, n) {
        if ((1 & e && (T(0, "div"), io(1, Gj, 2, 0, "small", 5), N()), 2 & e)) {
          const t = Ia(2);
          K(1),
            Ce(
              "ngIf",
              null == t.controlName || null == t.controlName.errors
                ? null
                : t.controlName.errors.required
            );
        }
      }
      function Wj(e, n) {
        if ((1 & e && (T(0, "small"), z(1), N()), 2 & e)) {
          const t = Ia(2);
          K(1), Ci(" ", t.messageError, " ");
        }
      }
      function Zj(e, n) {
        if (
          (1 & e &&
            (T(0, "div", 4),
            io(1, qj, 2, 1, "div", 5),
            io(2, Wj, 2, 1, "small", 5),
            N()),
          2 & e)
        ) {
          const t = Ia();
          K(1), Ce("ngIf", t.isError), K(1), Ce("ngIf", t.isValidDate);
        }
      }
      let mb = (() => {
        class e {
          constructor() {
            (this.idInput = ""),
              (this.typeInput = "text"),
              (this.placeholderInput = ""),
              (this.labelText = ""),
              (this.messageError = ""),
              (this.validatorMessage = ""),
              (this.dateFormatBr = new de()),
              (this.statusValidator = "");
          }
          get isValidDate() {
            return "INVALID" === this.statusValidator;
          }
          get isError() {
            return (
              (this.controlName.errors && this.controlName.touched) ||
              this.controlName.dirty
            );
          }
          ngOnInit() {}
          onChangeDate(t) {
            if (
              ((this.statusValidator = this.controlName.status),
              "date" === t.target.type)
            ) {
              const o = new Date(`${t.target.value}T00:00`);
              o.setMinutes(o.getTimezoneOffset());
              const i = o.toLocaleDateString("pt-BR").split("-")[0];
              return this.dateFormatBr.emit(i);
            }
            return null;
          }
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵcmp = Ue({
            type: e,
            selectors: [["app-input"]],
            inputs: {
              idInput: "idInput",
              typeInput: "typeInput",
              placeholderInput: "placeholderInput",
              labelText: "labelText",
              messageError: "messageError",
              validatorMessage: "validatorMessage",
              controlName: "controlName",
            },
            outputs: { dateFormatBr: "dateFormatBr" },
            decls: 5,
            vars: 7,
            consts: [
              [1, "input__container"],
              [1, "input-label", 3, "for"],
              [
                1,
                "input-content",
                3,
                "type",
                "id",
                "placeholder",
                "formControl",
                "change",
              ],
              ["class", "danger", 4, "ngIf"],
              [1, "danger"],
              [4, "ngIf"],
            ],
            template: function (r, o) {
              1 & r &&
                (T(0, "div", 0)(1, "label", 1),
                z(2),
                N(),
                T(3, "input", 2),
                Fe("change", function (s) {
                  return o.onChangeDate(s);
                }),
                N(),
                io(4, Zj, 3, 2, "div", 3),
                N()),
                2 & r &&
                  (K(1),
                  Ce("for", o.idInput),
                  K(1),
                  kt(o.labelText),
                  K(1),
                  Ce("type", o.typeInput)("id", o.idInput)(
                    "placeholder",
                    o.placeholderInput
                  )("formControl", o.controlName),
                  K(1),
                  Ce("ngIf", o.isValidDate || o.isError));
            },
            dependencies: [eC, Au, xE, uh],
            styles: [
              ".input__container[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-end;gap:.25rem;position:relative;height:100%;width:100%;padding:.5rem 1rem}.input-label[_ngcontent-%COMP%]{font-size:1.25rem;color:var(--text-color);font-weight:600}.input-content[_ngcontent-%COMP%]{border:none;outline:none;background-color:var(--text-color);color:var(--secondary-color);padding:.5rem .75rem;border-radius:.25rem;font-size:1rem;appearance:none}.input-content[_ngcontent-%COMP%]::placeholder{color:var(--secondary-color)}.danger[_ngcontent-%COMP%]{color:red;font-weight:600}",
            ],
          }));
        }
        return e;
      })();
      const Yj = [
        { path: "", component: ZV, title: "Home", pathMatch: "prefix" },
        {
          path: "register",
          component: (() => {
            class e {
              constructor(t, r) {
                (this.fb = t), (this.productService = r);
              }
              ngOnInit() {
                this.formRegister = this.fb.group({
                  name: ["", ns.required],
                  code: ["", ns.required],
                  price: ["", ns.required],
                  expirationDate: [
                    "",
                    [
                      ns.required,
                      (e) => {
                        const n = new Date(`${e.value}T00:00`);
                        if ((n.setMinutes(n.getTimezoneOffset()), !n))
                          return null;
                        const t = new Date(),
                          r = n.getDate(),
                          o = n.getMonth(),
                          i = n.getFullYear(),
                          s = t.getDate(),
                          a = t.getMonth(),
                          u = t.getFullYear();
                        return i < u ||
                          (i === u && o < a) ||
                          (i === u && o === a && r <= s)
                          ? { dateBeforeToday: !0 }
                          : null;
                      },
                    ],
                  ],
                  stock: ["", ns.required],
                });
              }
              onChangeDate(t) {
                this.formRegister.value.expirationDate = t;
              }
              onSubmit() {
                this.productService
                  .AddProduct(this.formRegister.value)
                  .subscribe({
                    next: (r) => alert(`Produto ${r.name} Cadastrado `),
                    error: (r) =>
                      console.error(`Erro no Envio do produto ${r}`),
                  });
              }
              static #e = (this.ɵfac = function (r) {
                return new (r || e)(C($j), C(nE));
              });
              static #t = (this.ɵcmp = Ue({
                type: e,
                selectors: [["app-register"]],
                decls: 10,
                vars: 6,
                consts: [
                  [1, "form__container", 3, "formGroup", "ngSubmit"],
                  [1, "form__title"],
                  [1, "form__content"],
                  [
                    "labelText",
                    "Nome:",
                    "typeInput",
                    "text",
                    "placeholderInput",
                    "Feij\xe3o",
                    "idInput",
                    "name",
                    1,
                    "form__group",
                    3,
                    "controlName",
                  ],
                  [
                    "labelText",
                    "C\xf3digo:",
                    "typeInput",
                    "number",
                    "placeholderInput",
                    "23",
                    "idInput",
                    "code",
                    1,
                    "form__group",
                    3,
                    "controlName",
                  ],
                  [
                    "labelText",
                    "Pre\xe7o:",
                    "typeInput",
                    "text",
                    "placeholderInput",
                    "22,25",
                    "idInput",
                    "price",
                    1,
                    "form__group",
                    3,
                    "controlName",
                  ],
                  [
                    "labelText",
                    "Data de Validade:",
                    "typeInput",
                    "date",
                    "idInput",
                    "expirationDate",
                    "messageError",
                    "Data de validade inv\xe1lida",
                    1,
                    "form__group",
                    3,
                    "controlName",
                    "dateFormatBr",
                  ],
                  [
                    "labelText",
                    "Quantidade:",
                    "typeInput",
                    "number",
                    "placeholderInput",
                    "32",
                    "idInput",
                    "quantity",
                    1,
                    "form__group",
                    3,
                    "controlName",
                  ],
                  [1, "btn-submit", 3, "submitEmmiter"],
                ],
                template: function (r, o) {
                  1 & r &&
                    (T(0, "form", 0),
                    Fe("ngSubmit", function () {
                      return o.onSubmit();
                    }),
                    T(1, "h1", 1),
                    z(2, "Lista de Compras"),
                    N(),
                    T(3, "div", 2),
                    bt(4, "app-input", 3)(5, "app-input", 4)(6, "app-input", 5),
                    T(7, "app-input", 6),
                    Fe("dateFormatBr", function (s) {
                      return o.onChangeDate(s);
                    }),
                    N(),
                    bt(8, "app-input", 7),
                    N(),
                    T(9, "app-button", 8),
                    Fe("submitEmmiter", function () {
                      return o.onSubmit;
                    }),
                    N()()),
                    2 & r &&
                      (Ce("formGroup", o.formRegister),
                      K(4),
                      Ce("controlName", o.formRegister.get("name")),
                      K(1),
                      Ce("controlName", o.formRegister.get("code")),
                      K(1),
                      Ce("controlName", o.formRegister.get("price")),
                      K(1),
                      Ce("controlName", o.formRegister.get("expirationDate")),
                      K(1),
                      Ce("controlName", o.formRegister.get("stock")));
                },
                dependencies: [gb, mb, WE, OE, ju],
                styles: [
                  ".form__container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;width:98%;padding:1rem .5rem}.form__content[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:.5rem;width:100%}.form__group[_ngcontent-%COMP%]{width:100%;background-color:var(--secondary-color);padding:.5rem 1rem;border-radius:.25rem}.form__title[_ngcontent-%COMP%]{color:var(--secondary-color);margin-bottom:1.5rem}.btn-submit[_ngcontent-%COMP%]{width:100%}",
                ],
              }));
            }
            return e;
          })(),
          title: "Cadastra Produtos",
        },
        {
          path: "contact",
          component: (() => {
            class e {
              static #e = (this.ɵfac = function (r) {
                return new (r || e)();
              });
              static #t = (this.ɵcmp = Ue({
                type: e,
                selectors: [["app-contact"]],
                decls: 2,
                vars: 0,
                template: function (r, o) {
                  1 & r && (T(0, "p"), z(1, "contact works!"), N());
                },
              }));
            }
            return e;
          })(),
          title: "Contato",
        },
        {
          path: "**",
          component: (() => {
            class e {
              static #e = (this.ɵfac = function (r) {
                return new (r || e)();
              });
              static #t = (this.ɵcmp = Ue({
                type: e,
                selectors: [["app-not-found"]],
                decls: 2,
                vars: 0,
                template: function (r, o) {
                  1 & r && (T(0, "p"), z(1, "not-found works!"), N());
                },
              }));
            }
            return e;
          })(),
          title: "Page not found",
        },
      ];
      let yb = (() => {
        class e {
          static #e = (this.ɵfac = function (r) {
            return new (r || e)();
          });
          static #t = (this.ɵmod = et({ type: e }));
          static #n = (this.ɵinj = $e({ imports: [eE.forRoot(Yj), eE] }));
        }
        return e;
      })();
      const Qj = function () {
        return { exact: !0 };
      };
      let Xj = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = Ue({
              type: e,
              selectors: [["app-nav-bar"]],
              decls: 23,
              vars: 2,
              consts: [
                [1, "menu__container"],
                [1, "btn-menu__container"],
                [1, "btn-menu__mobile"],
                [1, "material-symbols-outlined", "open"],
                [1, "material-symbols-outlined", "close"],
                [1, "menu-items"],
                [1, "item"],
                [
                  "routerLink",
                  "/",
                  "routerLinkActive",
                  "page-activated",
                  1,
                  "item-link",
                  3,
                  "routerLinkActiveOptions",
                ],
                [1, "material-symbols-outlined"],
                [
                  "routerLink",
                  "/register",
                  "routerLinkActive",
                  "page-activated",
                  1,
                  "item-link",
                ],
                [
                  "routerLink",
                  "/contact",
                  "routerLinkActive",
                  "page-activated",
                  1,
                  "item-link",
                ],
              ],
              template: function (r, o) {
                1 & r &&
                  (T(0, "nav", 0)(1, "div", 1)(2, "button", 2)(3, "span", 3),
                  z(4, " menu "),
                  N(),
                  T(5, "span", 4),
                  z(6, " close "),
                  N()()(),
                  T(7, "ul", 5)(8, "li", 6)(9, "a", 7),
                  z(10, " Home "),
                  T(11, "span", 8),
                  z(12, " home "),
                  N()()(),
                  T(13, "li", 6)(14, "a", 9),
                  z(15, " Cadastrar "),
                  T(16, "span", 8),
                  z(17, " note_add "),
                  N()()(),
                  T(18, "li", 6)(19, "a", 10),
                  z(20, " Contato "),
                  T(21, "span", 8),
                  z(22, " contact_page "),
                  N()()()()()),
                  2 & r &&
                    (K(9),
                    Ce(
                      "routerLinkActiveOptions",
                      (function gD(e, n, t) {
                        const r = qe() + e,
                          o = v();
                        return o[r] === V
                          ? Yt(o, r, t ? n.call(t) : n())
                          : (function gi(e, n) {
                              return e[n];
                            })(o, r);
                      })(1, Qj)
                    ));
              },
              dependencies: [Su, qw],
              styles: [
                ".menu__container[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:100%;padding:.25rem 1rem;height:100%}.btn-menu__container[_ngcontent-%COMP%]{display:none}.menu-items[_ngcontent-%COMP%]{list-style:none;display:grid;grid-template-columns:1fr 1fr 1fr;grid-gap:.5rem}.item[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center}.item-link[_ngcontent-%COMP%]{padding:.5rem 1rem;background:var(--text-color);cursor:pointer;border-radius:.5rem;color:var(--bg-color);font-weight:500;letter-spacing:1px;transition-duration:.4s;text-decoration:none;border:1px solid transparent;display:flex;align-items:center;justify-content:center;gap:.25rem}.item-link[_ngcontent-%COMP%]:hover{background-color:var(--primary-color);color:var(--bg-color)}.item[_ngcontent-%COMP%] > .page-activated[_ngcontent-%COMP%]{border-color:var(--text-color);background-color:var(--bg-color);color:var(--text-color)}",
              ],
            }));
          }
          return e;
        })(),
        Jj = (() => {
          class e {
            constructor() {
              this.title = "todo-list";
            }
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵcmp = Ue({
              type: e,
              selectors: [["app-root"]],
              decls: 9,
              vars: 0,
              consts: [
                [1, "app__container"],
                [1, "app-brand__content"],
                [
                  "src",
                  "/assets/images/icon-iventonet-512.png",
                  "alt",
                  "logo de cor verde clara com um icone de uma lapis e um caderdoe o nome INVENTONET",
                  1,
                  "app-brand",
                ],
                [1, "nav-bar"],
                [1, "main__container"],
              ],
              template: function (r, o) {
                1 & r &&
                  (T(0, "div", 0)(1, "header")(2, "div", 1),
                  bt(3, "img", 2),
                  N(),
                  bt(4, "app-nav-bar", 3),
                  N(),
                  T(5, "main", 4),
                  bt(6, "router-outlet"),
                  N(),
                  T(7, "footer"),
                  z(8, " Desenvolvido por Jo\xe3o Kleby "),
                  N()());
              },
              dependencies: [jf, Xj],
              styles: [
                ".app__container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:space-between;width:100vw;height:100vh;background-color:var(--bg-color)}header[_ngcontent-%COMP%], footer[_ngcontent-%COMP%]{width:100%;height:4.25rem;box-shadow:0 0 4px var(--text-color);background-color:var(--bg-color);display:flex;padding:0 1rem}.app-brand__content[_ngcontent-%COMP%]{display:flex;padding:1rem 0;max-width:100%;width:100%}.app-brand[_ngcontent-%COMP%]{max-width:100%;cursor:pointer}.main__container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%}",
              ],
            }));
          }
          return e;
        })(),
        Kj = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({ imports: [uf, pb, Uj, yb] }));
          }
          return e;
        })(),
        e2 = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e }));
            static #n = (this.ɵinj = $e({ imports: [uf, Kj, pb] }));
          }
          return e;
        })(),
        t2 = (() => {
          class e {
            static #e = (this.ɵfac = function (r) {
              return new (r || e)();
            });
            static #t = (this.ɵmod = et({ type: e, bootstrap: [Jj] }));
            static #n = (this.ɵinj = $e({ imports: [PF, yb, e2, lk] }));
          }
          return e;
        })();
      xF()
        .bootstrapModule(t2)
        .catch((e) => console.error(e));
    },
  },
  (ne) => {
    ne((ne.s = 352));
  },
]);
