"use strict";

var objectLocationX;
var objectLocationY;

var topLevel;
var top_z;


function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    event.dataTransfer.setData('id', event.target.id);
}

function drag_over(event) {
    event.preventDefault();
    return false;
}

var top_z = 1;

function bringToTop(element)
{
     topLevel = ++top_z;
     element.style.zIndex = topLevel;

}

function drop(event) {

    var elem = document.getElementById(event.dataTransfer.getData('id'));
    var offset = event.dataTransfer.getData("text/plain").split(',');
    objectLocationX = (event.clientX + parseInt(offset[0],10)) + 'px';
    objectLocationY = (event.clientY + parseInt(offset[1],10)) + 'px';

    bringToTop(elem);

    elem.style.left = objectLocationX;
    elem.style.top = objectLocationY;

    var object = {
      id: elem,
      locX: objectLocationX,
      locY: objectLocationY,
      lvl: topLevel

    };

    localStorage.setItem(elem.id,JSON.stringify(object));
    event.preventDefault();

    return false;

}

main.addEventListener('dragover',drag_over,false);
main.addEventListener('drop',drop,false);

var drags = document.querySelectorAll('.dragMe');

for(var i of drags){
    i.addEventListener('dragstart',drag_start,false);
    var item = JSON.parse(localStorage.getItem(i.id));
    i.style.left = item.locX;
    i.style.top = item.locY;
    i.style.zIndex = item.lvl;

}
