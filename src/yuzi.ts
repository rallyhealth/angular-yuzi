import * as angular from 'angular';
import './accessible-outlines/accessible-outlines.directive';
import './accordion/accordion.directive';
import './dropdown/dropdown.directive';

angular.module('yuzi', [
  'yuzi.accordion',
  'yuzi.dropdown',
  'yuzi.outlines'
]);
