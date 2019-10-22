var todo = {
    init: function () {
        var self = this;

        self.getByClass("addItem")[0].addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "inline";
        }, false);
        self.getById("btnCancel").addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "none";
            self.getById("addName").value = "";
            self.getById("subCat").options[0].selected = true;
        }, false);
        self.getById("btnConfirm").addEventListener("click", function () {
            var select = self.getById("subCat"),
                selectValue = select.options[select.selectedIndex].value,
                newName = self.getById("addName").value;
            if (newName) {
                if (selectValue === "newCategory") {
                    //新建主分类
                    var cat = new Category(newName, 0);
                    cat.addCat();
                } else {
                    //新建子分类
                    var nodes = self.getByClass("category"),
                        len = nodes.length;
                    for (let i = 0; i < len; i++) {
                        var a = nodes[i].getAttribute("data-category");
                        if (a === selectValue) {
                            var subCat = new Category(newName, 0);
                            subCat.addSub(nodes[i]);
                        }

                    }
                }
                self.getByClass("popWindow")[0].style.display = "none";
                self.getById("addName").value = "";
                select.options[0].selected = true;
            } else {
                alert("Please input a name for the new category!");
            }

        }, false);
        self.classAddListener("mainCat", "mouseenter", function (e) {
            var tar = e.target.getElementsByClassName("trashIcon");
            if (tar.length) {
                tar[0].style.display = "inline";
            }
        });
        self.classAddListener("mainCat", "mouseleave", function (e) {
            var tar = e.target.getElementsByClassName("trashIcon");
            if (tar.length) {
                tar[0].style.display = "none";
            }
        });
        self.classAddListener("subCat", "mouseenter", function (e) {
            var tar = e.target.getElementsByClassName("trashIcon");
            if (tar.length) {
                tar[0].style.display = "inline";
            }
        });
        self.classAddListener("subCat", "mouseleave", function (e) {
            var tar = e.target.getElementsByClassName("trashIcon");
            if (tar.length) {
                tar[0].style.display = "none";
            }
        });
        self.classAddListener("inSubCat", "click", function (e) {
            var tar = e.target.parentNode;
            if (tar.className.indexOf("subCat") >-1) {
                // tar.
            }
        });
        var Category = function (name, num) {
            this.name = name;
            this.num = num;
        };
        Category.prototype = {
            /* add sub assign */
            addSub: function (node) {
                node.innerHTML += "<div class='subCat'><span class='glyphicon glyphicon-file'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）</div>";
            },
            /** add new category  */
            addCat: function () {
                self.getById("leftItem").innerHTML += "<div class='category' data-category='" + this.name + "'><div class='mainCat'><span class='glyphicon glyphicon-folder-close'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）</div></div>";

                self.getById("subCat").innerHTML += "<option value='" + this.name + "'>" + this.name + "</option>";
            }

        };
    },
    getById: function (id) {
        return document.getElementById(id);
    },
    getByClass: function (className) {
        return document.getElementsByClassName(className);
    },
    getByTag: function (tag) {
        return document.getElementsByTagName(tag);
    },
    classAddListener: function (cls, eventType, func) {
        var self = this,
            classes = self.getByClass(cls),
            len = classes.length;
        if (typeof func === "function") {
            for (let i = 0; i < len; i++) {
                classes[i].addEventListener(eventType, func, false);
            }
        }
    }
};