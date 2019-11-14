var todo = {
    chosenSubitle: -1,
    chosenAssign: 0,
    assignIndex: 1,
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
                alert("Please input the name of the new category!");
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
            self.traverseClassNode(["subCat"], function (x) {
                x.classList.remove("chosen");
            });
            self.chosenSubitle = e.currentTarget.getAttribute("data-index");
            e.currentTarget.classList.add("chosen");
        });
        //新增任务
        self.getById("addAssign").addEventListener("click", function () {
            //if 选中分类
            if (self.chosenSubitle > -1) {
                self.getById("assignTitle").innerHTML = "<input type='text' class='inputTitle' placeholder='Please input a title' id='assTitle'>";
                self.getById("content").innerHTML = "<input type='text' class='inputContent' placeholder='Please input some content' id='assContent'>";
                self.getById("inputeDate").innerHTML = "<input type='date' name='deadline' id='deadline'>";

                //新建任务时，chosenAssign设为没有任务被选中
                self.chosenAssign = 0;
                //右上按钮变为 取消编辑和完成编辑
                self.getByClass("titleIcon")[0].classList.toggle("hide");
                self.getByClass("titleIcon")[1].classList.toggle("hide");
            } else {
                alert('Please choose a subCategory before adding an assignment');
            }

        }, false);

        //任务完成按钮
        self.getByClass("glyphicon-check")[0].addEventListener("click", function () {
            //对应任务title显示完成标签 如何找到对应任务？ 用chosenAssign存储被选中的assignIndex
            if (self.chosenAssign) { //选中了一个任务
                var assignment = self.getByClass("titleGroup")[self.chosenAssign - 1];
                if (parseInt(assignment.getAttribute("data-status")) === 0) { //如果该任务未完成（data-status为0）
                    assignment.innerHTML += "<div style='float: right;'><span class='glyphicon glyphicon-ok'></span></div>";
                    assignment.setAttribute("data-status", "1");
                } else { //如果该任务已完成
                    alert('The assignment has been finished!');
                }
            } else {
                alert('Please choose an assignment first!');
            }

        });
        //编辑任务按钮
        self.getByClass("glyphicon-edit")[0].addEventListener("click", function () {
            if (self.chosenAssign) { //选中了一个任务
                //现有内容放入编辑框，可以编辑
                var assignTitle = self.getById("assignTitle"),
                    inputeDate = self.getById("inputeDate"),
                    contentContainer = self.getById("content");
                assignTitle.innerHTML = "<input type='text' class='inputTitle' value=" + assignTitle.innerHTML + " id='assTitle'>";
                inputeDate.innerHTML = "<input type='date' name='deadline' id='deadline' value=" + inputeDate.innerHTML + " >";
                contentContainer.innerHTML = "<input type='text' class='inputContent' value=" + contentContainer.innerHTML + " id='assContent'>";

                //右上按钮变为 取消编辑和完成编辑
                self.getByClass("titleIcon")[0].classList.toggle("hide");
                self.getByClass("titleIcon")[1].classList.toggle("hide");
            } else {
                alert('Please choose an assignment first!');
            }

        });
        //取消编辑按钮
        self.getByClass("glyphicon-remove")[0].addEventListener("click", function () {
            var index = self.chosenAssign,
                assignTitle = self.getById("assignTitle"),
                inputeDate = self.getById("inputeDate"),
                contentContainer = self.getById("content");
            if (index) { //非新建任务，显示chosenAssign的任务信息
                var obj = JSON.parse(localStorage.getItem("Index" + index));
                assignTitle.innerHTML = obj.title;
                inputeDate.innerHTML = obj.date;
                contentContainer.innerHTML = obj.content;
            } else { //新建任务，右边信息清空
                assignTitle.innerHTML = "";
                inputeDate.innerHTML = "";
                contentContainer.innerHTML = "";
            }

            //右上按钮变为 完成和编辑按钮
            self.getByClass("titleIcon")[0].classList.toggle("hide");
            self.getByClass("titleIcon")[1].classList.toggle("hide");
        });
        //完成编辑按钮 新增（chosenAssign为0）或修改（chosenAssign不为0）
        self.getById("glyphicon-ok").addEventListener("click", function () {
            var date = self.getById("deadline").value,
                title = self.getById("assTitle").value,
                content = self.getById("assContent").value;

            if (title && date && content) { //任务标题、deadline、内容不为空
                var parentNode = self.getByClass("middleItem")[0],
                    assignTitle = self.getById("assignTitle"),
                    inputeDate = self.getById("inputeDate"),
                    contentContainer = self.getById("content"),
                    added = false;
                assignTitle.innerHTML = title;
                inputeDate.innerHTML = date;
                contentContainer.innerHTML = content;
                var obj = {
                    title: title,
                    date: date,
                    content: content
                };

                if (self.chosenAssign === 0) { //新增
                    //任务信息存到本地存储中（title,date,content）以title为索引项，status保存在DOM中
                    localStorage.setItem("Index" + self.assignIndex, JSON.stringify(obj)); //title
                    //点击提交任务后新任务默认显示在所有任务下（所有标签为选中状态）
                    var nodes = self.getByClass("fliter");
                    nodes[0].classList.add("fliterBackground");
                    nodes[1].classList.remove("fliterBackground");
                    nodes[2].classList.remove("fliterBackground");
                    //显示所有任务
                    self.traverseClassNode(["dateGroup", "dateBlock", "titleGroup"], function (node) {
                        node.classList.remove("hide");
                    });

                    var assign = document.createElement("DIV");
                    assign.classList.add("titleGroup");
                    assign.setAttribute("data-status", "0");
                    self.chosenAssign = self.assignIndex; //新增的任务成为选中任务
                    assign.setAttribute("data-assignIndex", self.assignIndex++);
                    assign.innerHTML = "<span class='theTitle'>" + title + "</span>";

                    //任务新增在任务栏中
                    for (var subDiv = parentNode.firstElementChild; subDiv; subDiv = subDiv.nextElementSibling) {
                        if (subDiv.getAttribute("data-duedate") > date) { //新增任务日期比所有已存在日期都小
                            var fragment = document.createElement("DIV");
                            fragment.classList.add("dateGroup");
                            fragment.setAttribute("data-duedate", date);
                            fragment.innerHTML = "<div class ='dateBlock'>" + date + "</div>";
                            fragment.appendChild(assign);
                            parentNode.insertBefore(fragment, subDiv);
                            added = true;
                            break;
                        } else if (subDiv.getAttribute("data-duedate") === date) { //已存在该日期分类
                            break;
                        }

                    }
                    if (!added) {
                        if (subDiv) { //已存在该日期分类，直接添加到该日期分类下
                            subDiv.appendChild(assign);
                        } else { //新增任务日期比所有已存在日期都大，添加到最末尾
                            var fragment = document.createElement("DIV");
                            fragment.classList.add("dateGroup");
                            fragment.setAttribute("data-duedate", date);
                            fragment.innerHTML = "<div class ='dateBlock'>" + date + "</div>";
                            fragment.appendChild(assign);
                            parentNode.appendChild(fragment);
                        }
                    }
                    //添加任务点击响应：显示对应任务内容
                    assign.addEventListener("click", function (e) {
                        var target = e.target,
                            // title = target.firstElementChild.innerHTML,
                            index = parseInt(target.getAttribute("data-assignIndex")),
                            obj = JSON.parse(localStorage.getItem("Index" + index));
                        assignTitle.innerHTML = obj.title;
                        inputeDate.innerHTML = obj.date;
                        contentContainer.innerHTML = obj.content;
                        self.chosenAssign = index;
                    }, false);
                } else { //修改
                    var origin = JSON.parse(localStorage.getItem("Index" + self.chosenAssign));
                    if (origin.date > date) { //日期变小了
                        //从头开始遍历
                    } else if (origin.date < date) { //日期变大了                        
                        //从原来日期的下一个开始遍历

                    }

                    localStorage.setItem("Index" + self.chosenAssign, JSON.stringify(obj));
                    // self.getByClass("titleGroup")[self.chosenAssign - 1].firstElementChild.innerHTML = title;

                }

                self.getByClass("titleIcon")[0].classList.toggle("hide");
                self.getByClass("titleIcon")[1].classList.toggle("hide");
            } else {
                alert("Title and due date is a must!");
            }
        }, false);

        var Category = function (name, num) {
            this.name = name;
            this.num = num;
        };
        Category.prototype = {
            /* add sub assign */
            addSub: function (node) {
                var div = document.createElement("DIV");
                div.classList.add("subCat");
                div.innerHTML = "<span class='glyphicon glyphicon-file'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）";
                node.appendChild(div);
                // node.innerHTML += "<div class='subCat'><span class='glyphicon glyphicon-file'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）</div>";
                // console.log();
                div.addEventListener("click", function (e) {
                    todo.traverseClassNode(["subCat"], function (x) {
                        x.classList.remove("chosen");
                    });
                    todo.chosenSubitle = e.currentTarget.getAttribute("data-index");
                    e.currentTarget.classList.add("chosen");
                }, false);

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
        var self = this;
        if (typeof func === "function") {
            for (let i = 0; i < cls.length; i++) {
                var nodeList = self.getByClass(cls[i]),
                    len = nodeList.length;
                for (let i = 0; i < len; i++) {
                    func(nodeList[i]);
                }
            }
        }

    }
};