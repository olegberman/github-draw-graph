/*global document:true, console:true*/
'use strict';

var app = {

  graphElement: null,
  today: new Date(),

  init: function() {
    this.graphElement = document.getElementById('repo-graph');
    this.makeSquares();
  },

  makeCell: function(className) {
    var cell = document.createElement('div');
    cell.className = className;
    return cell;
  },

  makeSquares: function() {
    var weeks = Math.ceil(365 / 7),
        emptyCells = 7 - this.today.getDay(),
        counter = 365;
    while (weeks--) {
      var weekCol = document.createElement('div');
      weekCol.className = 'week-col';
      while(emptyCells !== 0) {
        weekCol.appendChild(this.makeCell('cell-empty'));
        emptyCells = emptyCells - 1;
      }
      while(weekCol.childNodes.length < 7) {
        var cell = this.makeCell('cell');
        var date = new Date();
        var past = this.today.getDate() - counter;
        date.setDate(past);
        if(date > this.today) {
          break;
        }
        cell.setAttribute('data-date', date);
        cell.addEventListener('click', this.cellClicked.bind(this));
        weekCol.appendChild(cell);
        counter--;
      }
      this.graphElement.appendChild(weekCol);
    }
  },

  cellClicked: function(event) {
    var cell = event.target;
    var depth = parseInt(cell.getAttribute('data-depth'), 10);
    if(!depth) {
      depth = 1;
      cell.setAttribute('data-depth', depth);
      return this.updateColor(cell, depth);
    }
    if(depth === 4) {
      cell.setAttribute('data-depth', '');
      cell.style.backgroundColor = '#eeeeee';
    }
    depth = depth + 1;
    cell.setAttribute('data-depth', depth);
    return this.updateColor(cell, depth);
  },

  updateColor: function (cell, depth) {
    var colors = ['#d6e685', '#8cc665', '#44a340', '#1e6823'];
    cell.style.backgroundColor = colors[depth - 1];
  },

  save: function() {
    
  }

};

document.addEventListener('DOMContentLoaded', app.init.bind(app), false);
