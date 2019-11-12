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
            self.chosenSubitle = e.currentTarget.getAttribute("data-index");
            e.currentTarget.classList.add("chosen");
        });
        //新增任务
        self.getById("addAssign").addEventListener("click", function () {
            //if 选中分类
            if (self.chosenSubitle > -1) {
                self.getById("assignTitle").innerHTML = "<input type='text' class='inputTitle' placeholder='Please input a title' id='assTitle'>";
                self.getByClass("content")[0].innerHTML = "<input type='text' class='inputContent' placeholder='Please input some content' id='assContent'>";
                self.getById("inputeDate").innerHTML = "<input type='date' name='deadline' id='deadline'>";
            } else {
                alert('Choose a subCategory before adding an assignment');
            }

        }, false);
        //完成编辑
        self.getByClass("glyphicon-ok")[0].addEventListener("click", function () {
            var date = self.getById("deadline").value,
                title = self.getById("assTitle").value,
                content = self.getById("assContent").value,
                parentNode = self.getByClass("middleItem")[0],
                assignTitle = self.getById("assignTitle"),
                inputeDate = self.getById("inputeDate"),
                contentContainer = self.getByClass("content")[0],
                added = false;
            if (self.getById("assTitle").value && date) { //任务标题与deadline不为空
                assignTitle.innerHTML = title;
                inputeDate.innerHTML = date;
                contentContainer.innerHTML = content;
                var obj = {
                    title: title,
                    date: date,
                    content: content,
                    finished: 0
                };
                //任务信息存到本地存储中（title,date,content,status）以title为索引项
                localStorage.setItem(title, JSON.stringify(obj));
                //点击提交任务后新任务默认显示在所有任务下（所有标签为选中状态）
                var nodes = self.getByClass("fliter");
                nodes[0].classList.add("fliterBackground");
                nodes[1].classList.remove("fliterBackground");
                nodes[2].classList.remove("fliterBackground");
                //////////////////////////////////////////////////

                var assign = document.createElement("DIV");
                assign.classList.add("titleGroup");
                assign.innerHTML = title;
                //任务新增在任务栏中
                for (var subDiv = parentNode.firstElementChild; subDiv; subDiv = subDiv.nextElementSibling) {
                    if (subDiv.getAttribute("data-duedate") > date) { //新增任务日期比所有已存在日期都小
                        console.log("true");
                        var fragment = document.createElement("DIV");
                        fragment.setAttribute("data-duedate", date);
                        fragment.innerHTML = "<div class ='dateGroup'>" + date + "</div>";
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
                        fragment.setAttribute("data-duedate", date);
                        fragment.innerHTML = "<div class ='dateGroup'>" + date + "</div>";
                        fragment.appendChild(assign);
                        parentNode.appendChild(fragment);
                    }
                }
                //添加任务点击响应：显示对应任务内容
                assign.addEventListener("click", function (e) {
                    var title = e.target.innerHTML;
                    var obj = JSON.parse(localStorage.getItem(title));
                    assignTitle.innerHTML = obj.title;
                    inputeDate.innerHTML = obj.date;
                    contentContainer.innerHTML = obj.content;
                }, false);

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
                    todo.traverseClassNode("subCat", function (x) {
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