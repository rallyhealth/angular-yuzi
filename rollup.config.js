import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'dist/src/index.js',
  dest: 'dist/bundles/yuzi.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'rally.yuzi',
  onwarn: warning => { if (warning.code !== 'THIS_IS_UNDEFINED') console.warn(warning.message); },
  plugins: [
    nodeResolve({ jsnext: true, module: true }),
    commonjs({ include: 'node_modules/rxjs/**' }),
    uglify()
  ],
  external:[
    '@angular/core',
    '@angular/common',
    '@angular/router',
    '@angular/forms',
    'rxjs/Observable',
    'rxjs/add/operator/do',
    'rxjs/add/operator/filter',
    'rxjs/add/operator/mergeMap',
    'rxjs/add/operator/pairwise'
  ],
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/router': 'ng.router',
    '@angular/forms': 'ng.forms',
    'rxjs/Observable': 'Rx',
    'rxjs/add/operator/do': 'Rx.Observable.prototype',
    'rxjs/add/operator/filter': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/operator/pairwise': 'Rx.Observable.prototype'
  }
}
