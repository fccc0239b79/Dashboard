"use strict";

var drags = document.querySelectorAll('.dragMe');

function loadDefaultStorage(){

  for(var i of drags){
    var left = window.getComputedStyle(i).left;
    var top = window.getComputedStyle(i).top;
    var topLvl = window.getComputedStyle(i).zIndex;

    var object = {
      id:i.id,
      locX:left,
      locY:top,
      lvl: topLvl
      
    };

    localStorage.setItem(i.id, JSON.stringify(object));
  }

}


function loadPositions(){
    for(var i of drags){
      var retrieve = JSON.parse(localStorage.getItem(i.id));
      i.style.left = retrieve.locX + 'px';
      i.style.top = retrieve.locY + 'px';
      i.style.zIndex = retrieve.lvl;
    }


}

window.addEventListener('load', function(){
  if(localStorage.getItem('stickyNotesPanel') == null){
      loadDefaultStorage();
  }else {
    loadPositions();
  }
});
