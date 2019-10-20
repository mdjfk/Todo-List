var todo = {
    init: function () {
        var self = this;
        // self.getById("addCat").addEventListener("click", function () {
        //     var catName = prompt("请输入分类的名称", "新建分类");
        //     if (catName) {
        //         var cat = new Category(catName, 0);
        //         cat.addCat();
        //     }

        // });
        self.getByClass("addItem")[0].addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "inline";
        });
        self.getById("btnCancel").addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "none";
        });
        self.getById("btnConfirm").addEventListener("click", function () {
            var select = self.getById("subCat"),
                selectValue = select.options[select.selectedIndex].value;
            alert(selectValue);
            self.getByClass("popWindow")[0].style.display = "none";
        });
        var Category = function (name, num) {
            this.name = name;
            this.num = num;
        };
        Category.prototype = {
            /* add sub assign */
            addSub: function (name, date) {

            },
            /** delete sub assign */
            deleteSub: function () {

            },
            /** add new category  */
            addCat: function () {
                // var node = self.createElement("div", "category");
                // var subNode1 = self.createElement("span", "glyphicon", "glyphicon-folder-close");
                // node.appendChild(subNode1);
                // node.innerHTML += "&nbsp;" + " " + this.name + " （";
                // node.appendChild

                // var textNode1 = self.createTextNode("&amp;nbsp; " + this.name + " （");
                // var textNode2 = self.createTextNode("）");
                // var subNode2 = self.createElement("span", "assignNum");
                // subNode2.innerHTML = this.num;
                // self.appendChildren(node, subNode1, textNode1, subNode2, textNode2);

                document.getElementById("leftItem").innerHTML += "<div class='category'><span class='glyphicon glyphicon-folder-close'></span>&nbsp; " + this.name + " （<span class='defaultAssignNum'>" + this.num + "</span>）</div>";
                // document.getElementById("leftItem").appendChild(node);
            },
            /** delete category  */
            deleteCat: function () {

            },
            /** show category chosen style */
            chosen: function () {

            },
            /** show category unchosen style */
            unchosen: function () {

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