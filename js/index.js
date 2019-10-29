var todo = {
    chosenSubitle: -1,
    init: function () {
        var self = this;

        self.getByClass("addItem")[0].addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "inline";
        }, false);
        //弹窗 取消按钮
        self.getById("btnCancel").addEventListener("click", function () {
            self.getByClass("popWindow")[0].style.display = "none";
            self.getById("addName").value = "";
            self.getById("subCat").options[0].selected = true;
        }, false);
        //弹窗 确认按钮
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
        //显示及隐藏删除图标
        var toggleShow = function (e) {
            var tar = e.target.getElementsByClassName("trashIcon");
            if (tar.length) {
                tar[0].classList.toggle("hide");

            }
        };
        self.classAddListener("mainCat", "mouseenter", toggleShow);
        self.classAddListener("mainCat", "mouseleave", toggleShow);
        self.classAddListener("subCat", "mouseenter", toggleShow);
        self.classAddListener("subCat", "mouseleave", toggleShow);
        //选中子分类样式
        self.classAddListener("subCat", "click", function (e) {
            self.traverseClassNode("subCat", function (x) {
                x.classList.remove("chosen");
            });
            e.target.classList.add("chosen");
        });
        //新增任务
        self.getById("addAssign").addEventListener("click", function () {
            self.getById("assignTitle").innerHTML = "<input type='text' class='inputTitle' placeholder='Please input a title' id='assTitle'>";
            self.getByClass("content")[0].innerHTML = "<input type='text' class='inputContent' placeholder='Please input some content' id='assContent'>";
            self.getByClass("glyphicon-plus")[0].addEventListener("click", function () {
                self.getById("assignTitle").innerHTML = self.getById("assTitle").value;
                self.getByClass("content")[0].innerHTML = self.getById("assContent").value;
            }, false);
        }, false);
        //完成编辑

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
    },
    traverseClassNode: function (cls, func) {
        var self = this,
            nodeList = self.getByClass(cls),
            len = nodeList.length;
        if (typeof func === "function") {
            for (let i = 0; i < len; i++) {
                func(nodeList[i]);
            }
        }

    }
};