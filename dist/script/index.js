"use strict";
const getName = (collapsible) => {
    return collapsible.previousSibling.innerHTML;
};
const getContent = (collapsible) => {
    return collapsible.parentNode.nextSibling;
};
const setItem = (name, value) => {
    if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(name, value);
    }
};
const getItem = (name) => {
    if (typeof sessionStorage !== "undefined") {
        return sessionStorage.getItem(name);
    }
    else {
        return false;
    }
};
const collapsibles = document.getElementsByClassName("collapsible");
for (const collapsible of collapsibles) {
    // Active
    {
        const name = getName(collapsible);
        const active = getItem(name);
        if (active === "true") {
            collapsible.classList.add("active");
            const content = getContent(collapsible);
            content.style.display = "block";
        }
    }
    // Click event
    collapsible.addEventListener("click", function () {
        this.classList.toggle("active");
        const name = getName(this);
        const content = getContent(this);
        if (content.style.display === "block") {
            setItem(name, false);
            content.style.display = "none";
        }
        else {
            setItem(name, true);
            content.style.display = "block";
        }
    });
}
