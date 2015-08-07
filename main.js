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
        firstIteration = true,
        counter = 365;
    while (weeks--) {
      var weekCol = document.createElement('div');
      weekCol.className = 'week-col';
      while(weekCol.childNodes.length < 7) {
        var date = new Date();
        var past = this.today.getDate() - counter;
        date.setDate(past);
        if(firstIteration) {
          var emptyCells = date.getDay();
          while(emptyCells !== 0) {
            weekCol.appendChild(this.makeCell('cell-empty'));
            emptyCells = emptyCells - 1;
          }
          firstIteration = false;
        }
        if(date > this.today) {
          break;
        }
        var cell = this.makeCell('cell');
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
      return true;
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
    var cells = document.getElementsByClassName('cell');
    var name = document.getElementById('repo-name').value;
    cells = Array.prototype.slice.call(cells);
    var commits = cells.reduce(function(prev, cur, i) {
      var depth = cells[i].getAttribute('data-depth');
      if(parseInt(depth, 10)) {
        return prev + depth + ':' + cells[i].getAttribute('data-date') + '\n';
      } else {
        return prev;
      }
    }, '');
    $.post('/', {'name': name, 'commits': commits}, function(data) {
      if(data.success) {
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('instructions').style.display = 'block';
      }
    });
  }

};

document.addEventListener('DOMContentLoaded', app.init.bind(app), false);
