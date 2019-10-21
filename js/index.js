var todo = {
    init: function () {
        var self = this;

        self.getByClass("addItem")[0].addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "inline";
        });
        self.getById("btnCancel").addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "none";
            self.getById("addName").value = "";
        });
        self.getById("btnConfirm").addEventListener("click", function () {
            var select = self.getById("subCat"),
                selectValue = select.options[select.selectedIndex].value,
                newName = self.getById("addName").value;
            if (newName) {
                alert(selectValue);
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
                        alert(a);
                        if (a === selectValue) {
                            var subCat = new Category(newName, 0);
                            subCat.addSub(nodes[i]);
                        }

                    }
                }
                self.getByClass("popWindow")[0].style.display = "none";
                self.getById("addName").value = "";
            } else {
                alert("Please input a name for the new category!");
            }
            // alert(selectValue);

        });
        var Category = function (name, num) {
            this.name = name;
            this.num = num;
        };
        Category.prototype = {
            /* add sub assign */
            addSub: function (node) {

                // <div class="subCat">
                //     <span class="glyphicon glyphicon-file"></span>&nbsp; 说明 （<span class="assignNum">0</span>）
                //         </div>
                node.innerHTML += "<div class='subCat'><span class='glyphicon glyphicon-file'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）</div>";
            },
            /** add new category  */
            addCat: function () {
                self.getById("leftItem").innerHTML += "<div class='category' data-category='" + this.name + "'><div class='mainCat'><span class='glyphicon glyphicon-folder-close'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）</div></div>";

                // self.getById("leftItem").innerHTML += "<div class='category'><span class='glyphicon glyphicon-folder-close'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）</div>";
            }

        };
        // getByClass("category")
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
    addListener: function () {

    },
    /** create a node(whose type is elementType) with classes */
    createElement: function (elementType, ...classes) {
        var ele = document.createElement(elementType);
        var attr = document.createAttribute("class");
        var len = classes.length;
        var str = classes[0];
        for (let i = 1; i < len; i++) {
            str += " " + classes[i];
        }
        attr.value = str;
        ele.setAttributeNode(attr);
        return ele;
    },
    createTextNode: function (text) {
        return document.createTextNode(text);
    },
    appendChildren: function (parent, ...childNode) {
        var len = childNode.length;
        for (let i = 0; i < len; i++) {
            parent.appendChild(childNode[i]);

        }
    }
};