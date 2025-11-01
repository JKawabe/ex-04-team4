"use strict";

const boxes = document.querySelectorAll("[id^='box-hover']");
const boxes_detail = document.querySelectorAll("[id^='box-detail-hover']");

for (let i = 0; i < boxes.length; i++) {
  boxes[i].addEventListener("mouseover", function () {
    for(let j = 0; j < boxes.length; j++){
      if( i !== j && boxes_detail[j].style.display === "block" ) {
        boxes_detail[j].style.display = "none";
        boxes_detail[j].style.opacity = 0;
        boxes_detail[i].style.transform = "translateX(0px)";
      }
    }
    boxes_detail[i].style.display = "block";
    setTimeout(() => {
      boxes_detail[i].style.opacity = '1';
      boxes_detail[i].style.transform = "translateX(20px)";
    }, 1);
  });
  boxes[i].addEventListener("mouseleave", function () {
  });
};


document.addEventListener('DOMContentLoaded', function () {
  const animatedElements = document.querySelectorAll("[id^='one-comment']");
  animatedElements.forEach(function (animatedElement) {
    const elementPosition = animatedElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (elementPosition.top < windowHeight) {
        animatedElement.style.opacity = 1;
        animatedElement.style.transform = "translateX(0px)";
    } else {
      window.addEventListener('scroll', function () {
        const elementPosition = animatedElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (elementPosition.top < windowHeight) {
            animatedElement.style.opacity = 1;
            animatedElement.style.transform = "translateX(0px)";
        }
      });
    }
    }
  );
});

const editDisplayButton = document.getElementById("edit-display-button");
const editOverview = document.getElementById("edit-overview");
const editButton = document.getElementById("edit-button");
const copyButtons = document.querySelectorAll("[id^='copy-button']");

editDisplayButton.addEventListener("click", function () {
  editButton.style.display = "inline";
  editOverview.style.display = "inline";
  editDisplayButton.style.display = "none";
});

window.addEventListener("load", function () {
  const params = new URLSearchParams(location.search);
  const tagv = document.getElementById("hash");
  const tagv2 = document.getElementById("tags");
  if (params.get("hashtag") !== null) {
    tagv.innerHTML = "#" + params.get("hashtag") + "";
    tagv2.innerHTML = "#" + params.get("hashtag") + "";
  }
});

function finishAnimation() {
  const animatedElements = document.querySelectorAll("[id^='one-comment']");
  animatedElements.forEach(function (animatedElement) {
    animatedElement.style.opacity = 1;
    animatedElement.style.transform = "translateX(0px)";
    animatedElement.style.transition = "opacity 0s ease-in-out";
  });
}

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}
function scrollToUpper() {
  window.scrollTo(0, 0);
}

function rep(id) {
  let replyNum = document.getElementById("reply").value;
  if (replyNum !== id) {
    replyNum = id;
  } else {
    replyNum = -1;
  }
  document.getElementById("reply").value = replyNum;
  const viewRep = document.getElementById("repView");
  if (replyNum === -1) {
    viewRep.innerHTML = "未選択";
  } else {
    viewRep.innerHTML = replyNum;
  }
}

copyButtons.forEach(function (copyButton) {
  copyButton.addEventListener("click", function () {
    navigator.clipboard.writeText(copyButton.getAttribute("data-copyContent"));
  });
});
