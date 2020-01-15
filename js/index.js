var todo = {
    chosenCategory: null,
    chosenSubtitle: null,
    chosenAssign: null,
    assignIndex: parseInt(localStorage.getItem("assignIndex") || 1),
    assignmentType: 0,
    init: function () {
        (function (arr) {
            arr.forEach(function (item) {
                if (item.hasOwnProperty('remove')) {
                    return;
                }
                Object.defineProperty(item, 'remove', {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: function remove() {
                        if (this.parentNode === null) {
                            return;
                        }
                        this.parentNode.removeChild(this);
                    }
                });
            });
        })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
        (function (arr) {
            arr.forEach(function (item) {
                if (item.hasOwnProperty('includes')) {
                    return;
                }
                Object.defineProperty(item, 'includes', {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: function includes(valueToFind) {
                        this.forEach(function (item) {
                            if (item === valueToFind) {
                                return true;
                            }
                        });
                        return false;
                    }
                });
            });
        })([Array.prototype]);

        var self = this;
        // localStorage.clear();

        //左栏点击事件
        self.getByClass("leftArea")[0].addEventListener("click", function (e) {
            var target = e.target;
            if (target.nodeType === 1) {
                switch (true) {
                    //子分类点击 选中子分类
                    case target.className.indexOf("glyphicon-file") != -1 || target.className.indexOf("assignNum") != -1:
                        target = target.parentNode;
                    case target.className.indexOf("subCat") != -1:
                        (function (e) {
                            self.traverseClassNode(["subCat"], function (x) {
                                x.classList.remove("chosen");
                            });
                            self.chosenSubtitle = target;
                            self.chosenCategory = target.parentNode;
                            target.classList.add("chosen");

                            //中栏显示该分类的任务
                            self.showAllAssignment();
                            self.filterAssignment(self.chosenCategory.getAttribute("data-category"), target.getAttribute("data-string"), self.assignmentType, self.hide);

                        })();
                        break;
                        //删除图标点击
                    case target.className.indexOf("trashIcon") != -1:
                        let mainCatName = target.parentNode.parentNode.getAttribute("data-category");
                        if (target.parentNode.className.indexOf("mainCat") != -1) {
                            self.filterAssignment(mainCatName, null, self.assignmentType, self.delete, 1);
                            //删除这个主分类，更新总未完成任务数
                            var numNode = self.getById("assignNum");
                            numNode.innerHTML = parseInt(numNode.innerHTML) - parseInt(target.previousElementSibling.innerHTML);
                            //存储localStorage
                            localStorage.setItem("totalUnfinished", numNode.innerHTML);
                            localStorage.removeItem("unfinished" + mainCatName);
                            localStorage.removeItem(mainCatName);
                            self.removeItem(mainCatName, "name");

                            let sub = target.parentNode.parentNode.querySelectorAll(".subCat");
                            for (let i = 0, len = sub.length; i < len; i++) {
                                localStorage.removeItem("unfinished" + mainCatName + sub[i].getAttribute("data-string"));
                            }

                            target.parentNode.parentNode.remove();

                            //显示所有任务：同点击所有任务的效果
                            self.setFilter(0);
                            self.showAllAssignment();
                            self.chosenCategory = null;
                            self.chosenSubtitle = null;
                            self.chosenAssign = null;
                            self.traverseClassNode(["subCat"], function (x) {
                                x.classList.remove("chosen");
                            });

                            //删除下拉列表中的该分类
                            for (let thisOption = self.getById("subCat").firstElementChild.nextElementSibling; thisOption; thisOption = thisOption.nextElementSibling) {
                                if (thisOption.value === mainCatName) {
                                    thisOption.remove();
                                    break;
                                }

                            }

                        } else if (target.parentNode.className.indexOf("subCat") != -1) {
                            self.filterAssignment(target.parentNode.parentNode.getAttribute("data-category"), target.parentNode.getAttribute("data-string"), self.assignmentType, self.delete, 1);
                            //删除这个子分类，更新所在主分类的未完成任务数，更新总未完成任务数
                            var numNode = target.parentNode.parentNode.querySelector(".assignNum");
                            numNode.innerHTML = parseInt(numNode.innerHTML) - parseInt(target.previousElementSibling.innerHTML);
                            var numNode2 = self.getById("assignNum");
                            numNode2.innerHTML = parseInt(numNode2.innerHTML) - parseInt(target.previousElementSibling.innerHTML);
                            //存储localStorage
                            localStorage.setItem("unfinished" + target.parentNode.parentNode.getAttribute("data-category"), numNode.innerHTML);
                            localStorage.setItem("totalUnfinished", numNode2.innerHTML);
                            localStorage.removeItem("unfinished" + target.parentNode.parentNode.getAttribute("data-category") + target.parentNode.getAttribute("data-string"));

                            self.removeItem(target.parentNode.getAttribute("data-string"), target.parentNode.parentNode.getAttribute("data-category"));

                            target.parentNode.remove();

                            //显示所有任务：同点击所有任务的效果
                            self.setFilter(0);
                            self.showAllAssignment();
                            self.chosenCategory = null;
                            self.chosenSubtitle = null;
                            self.chosenAssign = null;
                            self.traverseClassNode(["subCat"], function (x) {
                                x.classList.remove("chosen");
                            });
                        }

                        break;
                        //新增分类点击响应
                    case target.className.indexOf("addItem") != -1:
                        self.getByClass("popWindow")[0].style.display = "inline";
                        break;
                        //所有分类点击响应
                    case target.id == "allAssignments" || target.id == "assignNum":
                        self.setFilter(0);
                        self.showAllAssignment();
                        self.chosenCategory = null;
                        self.chosenSubtitle = null;
                        self.chosenAssign = null;
                        self.traverseClassNode(["subCat"], function (x) {
                            x.classList.remove("chosen");
                        });
                        break;
                    default:
                        break;
                }
            }
        });
        //TODO:左栏hover事件响应

        //中栏点击事件
        self.getByClass("middleArea")[0].addEventListener("click", function (e) {
            var target = e.target;
            if (target.nodeType === 1) {
                let subcat = self.chosenSubtitle ? self.chosenSubtitle.getAttribute("data-string") : null,
                    maincat = self.chosenCategory ? self.chosenCategory.getAttribute("data-category") : null
                type = 0;
                switch (true) {
                    //新增任务按钮
                    case target.id == "addAssign":
                        self.addAssignmentBtn();
                        break;
                        //任务点击
                    case target.className.indexOf("theTitle") != -1 || target.className.indexOf("glyphicon-ok") != -1:
                        target = target.parentNode;
                    case target.className.indexOf("titleGroup") != -1:
                        self.assignmentClick(target);
                        break;
                    case target.id === "allBtn":
                        self.setFilter(type);
                        self.showAllAssignment();
                        self.filterAssignment(maincat, subcat, type, self.hide);
                        break;
                    case target.id === "unfinishedBtn":
                        type = 1;
                        self.setFilter(type);
                        self.showAllAssignment();
                        self.filterAssignment(maincat, subcat, type, self.hide);
                        break;
                    case target.id === "finishedBtn":
                        type = 2;
                        self.setFilter(type);
                        self.showAllAssignment();
                        self.filterAssignment(maincat, subcat, type, self.hide);
                        break;
                    default:
                        break;
                }

            }

        });
        //右栏点击事件
        self.getByClass("rightArea")[0].addEventListener("click", function (e) {
            var target = e.target;
            if (target.nodeType === 1) {
                switch (true) {
                    //任务完成按钮
                    case target.className.indexOf("glyphicon-check") != -1:
                        (function () {
                            //对应任务title显示完成标签 如何找到对应任务？ 用chosenAssign存储被选中的任务
                            var assignment = self.chosenAssign;
                            if (assignment) { //选中了一个任务
                                if (parseInt(assignment.getAttribute("data-status")) === 0) { //如果该任务未完成（data-status为0-未完成，为1-已完成，index + "status"为1-未完成，为2-已完成）
                                    if (window.confirm("Do you really want to finish this assignment?")) {
                                        assignment.innerHTML += "<div style='float: right;'><span class='glyphicon glyphicon-ok'></span></div>";
                                        assignment.setAttribute("data-status", "1");
                                        localStorage.setItem(assignment.getAttribute("data-assignIndex") + "status", 2);
                                        self.setUnfinished(-1, assignment);
                                    }

                                } else { //如果该任务已完成
                                    alert('The assignment has been finished!');
                                }
                            } else {
                                alert('Please choose an assignment first!');
                            }

                        })();
                        break;
                        //编辑任务按钮
                    case target.className.indexOf("glyphicon-edit") != -1:
                        (function () {
                            if (self.chosenAssign) { //选中了一个任务
                                //现有内容放入编辑框，可以编辑
                                var assignTitle = self.getById("assignTitle"),
                                    inputDate = self.getById("inputDate"),
                                    contentContainer = self.getById("content");
                                assignTitle.innerHTML = "<input type='text' class='inputTitle' value=" + assignTitle.innerHTML + " id='assTitle'>";
                                inputDate.innerHTML = "<input type='date' name='deadline' id='deadline' value=" + inputDate.innerHTML + " >";
                                contentContainer.innerHTML = "<textarea class='inputContent' value=" + contentContainer.innerHTML + " id='assContent'></textarea>";

                                //右上按钮变为 取消编辑和完成编辑
                                self.getByClass("titleIcon")[0].classList.toggle("hide");
                                self.getByClass("titleIcon")[1].classList.toggle("hide");
                            } else {
                                alert('Please choose an assignment first!');
                            }

                        })();
                        break;
                        //取消编辑按钮
                    case target.className.indexOf("glyphicon-remove") != -1:
                        (function () {
                            var index = self.chosenAssign,
                                assignTitle = self.getById("assignTitle"),
                                inputDate = self.getById("inputDate"),
                                contentContainer = self.getById("content");
                            if (index) { //非新建任务，显示chosenAssign的任务信息
                                var obj = JSON.parse(localStorage.getItem("Index" + index.getAttribute("data-assignIndex")));
                                assignTitle.innerHTML = obj.title;
                                inputDate.innerHTML = obj.date;
                                contentContainer.innerHTML = obj.content;
                            } else { //新建任务，信息清空
                                assignTitle.innerHTML = "";
                                inputDate.innerHTML = "";
                                contentContainer.innerHTML = "";
                            }

                            //右上按钮变为 完成和编辑按钮
                            self.getByClass("titleIcon")[0].classList.toggle("hide");
                            self.getByClass("titleIcon")[1].classList.toggle("hide");
                        })();
                        break;
                        //完成编辑按钮
                    case target.id === "glyphicon-ok":
                        (function () {
                            var date = self.getById("deadline").value,
                                title = self.getById("assTitle").value,
                                content = self.getById("assContent").value;

                            if (title && date && content) { //任务标题、deadline、内容不为空
                                var parentNode = self.getByClass("middleItem")[0],
                                    assignTitle = self.getById("assignTitle"),
                                    inputDate = self.getById("inputDate"),
                                    contentContainer = self.getById("content"),
                                    added = false;
                                assignTitle.innerHTML = title;
                                inputDate.innerHTML = date;
                                contentContainer.innerHTML = content;
                                var obj = {
                                    title: title,
                                    date: date,
                                    content: content
                                };

                                if (self.chosenAssign === null) { //新增
                                    //任务信息存到本地存储中（title,date,content）以index为索引项，status保存在DOM中
                                    localStorage.setItem("Index" + self.assignIndex, JSON.stringify(obj)); //title
                                    //点击提交任务后新任务默认显示在所有任务下（所有标签为选中状态）
                                    self.setFilter(0);

                                    //显示所有任务（显示该分类下所有任务）
                                    self.showAllAssignment();
                                    self.filterAssignment(self.chosenCategory.getAttribute("data-category"), self.chosenSubtitle.getAttribute("data-string"), 0, self.hide);


                                    //更新存储日期
                                    self.addItemToArr(date, "date");
                                    self.addItemToArr(self.assignIndex + "", date);
                                    localStorage.setItem(self.assignIndex + "main", self.chosenCategory.getAttribute("data-category"));
                                    localStorage.setItem(self.assignIndex + "sub", self.chosenSubtitle.getAttribute("data-string"));
                                    localStorage.setItem(self.assignIndex + "status", 1);

                                    //新建一个任务，并将新增的任务设为选中任务
                                    var assign = self.newAssignment(0, title);
                                    self.chosenAssign = assign; //新增的任务成为选中任务

                                    //任务新增在任务栏中
                                    for (var subDiv = parentNode.firstElementChild; subDiv; subDiv = subDiv.nextElementSibling) {
                                        if (subDiv.getAttribute("data-deadline") > date) { //新增任务日期比所有已存在日期都小
                                            self.addAssignmentDOM(parentNode, subDiv, date, assign);
                                            added = true;
                                            break;
                                        } else if (subDiv.getAttribute("data-deadline") === date) { //已存在该日期分类
                                            break;
                                        }

                                    }
                                    if (!added) {
                                        if (subDiv) { //已存在该日期分类，直接添加到该日期分类下
                                            subDiv.appendChild(assign);
                                        } else { //新增任务日期比所有已存在日期都大，添加到最末尾
                                            self.addAssignmentDOM(parentNode, subDiv, date, assign);
                                        }
                                    }

                                    //设置未完成任务数 加一
                                    self.setUnfinished(1, assign);

                                } else { //修改
                                    var origin = JSON.parse(localStorage.getItem("Index" + self.chosenAssign.getAttribute("data-assignIndex")));
                                    if (origin.date > date) { //日期变小了
                                        //从头开始遍历
                                        self.addAssignment(parentNode.firstElementChild, date, self.chosenAssign);
                                    } else if (origin.date < date) { //日期变大了
                                        //从原来日期的下一个日期开始遍历
                                        self.addAssignment(self.chosenAssign.nextElementSibling, date, self.chosenAssign);
                                    }
                                    self.chosenAssign.firstElementChild.innerHTML = title;
                                    localStorage.setItem("Index" + self.chosenAssign.getAttribute("data-assignIndex"), JSON.stringify(obj));

                                }

                                self.getByClass("titleIcon")[0].classList.toggle("hide");
                                self.getByClass("titleIcon")[1].classList.toggle("hide");
                            } else {
                                alert("Title and due date is a must!");
                            }
                        })();
                        break;
                    default:
                        break;
                }

            }

        });


        //弹窗点击事件
        self.getByClass("popWindow")[0].addEventListener("click", function (e) {
            var target = e.target;
            if (target.nodeName === "BUTTON") {
                switch (true) {
                    //弹窗 确认按钮
                    case target.id === "btnConfirm":
                        (function () {
                            var select = self.getById("subCat"),
                                selectValue = select.options[select.selectedIndex].value,
                                newName = self.getById("addName").value;
                            if (newName) {
                                if (selectValue === "newCategory") {
                                    //新建主分类
                                    var cat = new Category(newName);
                                    cat.addCat();
                                } else {
                                    //新建子分类
                                    var nodes = self.getByClass("category"),
                                        len = nodes.length;
                                    for (let i = 0; i < len; i++) {
                                        var a = nodes[i].getAttribute("data-category");
                                        if (a === selectValue) {
                                            var subCat = new Category(newName);
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

                        })();
                        break;
                        //弹窗 取消按钮
                    case target.id === "btnCancel":
                        (function () {
                            self.getByClass("popWindow")[0].style.display = "none";
                            self.getById("addName").value = "";
                            self.getById("subCat").options[0].selected = true;
                        })();
                        break;
                    default:
                        break;
                }

            }

        });

        //-------------------------每个主分类、子分类被添加后都要再次添加，主分类、子分类是动态的------------------------//
        //显示及隐藏删除图标
        function toggleShow(e) {
            var tar = e.target.getElementsByClassName("trashIcon");
            if (tar.length) {
                tar[0].classList.toggle("hide");
            }
        }
        //显示及隐藏删除图标
        function toggleTrashIcon(node) {
            node.addEventListener("mouseenter", toggleShow, false);
            node.addEventListener("mouseleave", toggleShow, false);
        }

        //-------------------------------------------------//
        var Category = function (name, num) {
            this.name = name;
            this.num = num || 0;
        };
        Category.prototype = {
            /** 添加子分类 */
            addSub: function (node, addItem) {
                //新建（不定义addItem）或初始化显示（addItem置零）
                addItem = (typeof addItem === "undefined") ? 1 : addItem;
                var self = this,
                    div = document.createElement("DIV");
                div.classList.add("subCat");
                div.setAttribute("data-string", self.name);
                div.innerHTML = "<span class='glyphicon glyphicon-file'></span>&nbsp; " + self.name + " （<span class='assignNum'>" + self.num + "</span>）<span class='glyphicon glyphicon-trash trashIcon inSubCat hide'></span>";
                node.appendChild(div);
                // node.innerHTML += "<div class='subCat'><span class='glyphicon glyphicon-file'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）</div>";

                //显示及隐藏删除图标
                toggleTrashIcon(div);

                //数据存储
                if (addItem) {
                    todo.addItemToArr(this.name, node.getAttribute("data-category"));
                }
            },
            /** 添加主分类 */
            addCat: function (addItem) {
                addItem = (typeof addItem === "undefined") ? 1 : addItem;
                var cat = document.createElement("DIV");
                cat.classList.add("category");
                cat.setAttribute("data-category", this.name);
                var mainCat = document.createElement("DIV");
                mainCat.classList.add("mainCat");
                cat.appendChild(mainCat);
                mainCat.innerHTML = "<span class='glyphicon glyphicon-folder-close'></span>&nbsp; " + this.name + " （<span class='assignNum'>" + this.num + "</span>）<span class='glyphicon glyphicon-trash trashIcon inMainCat hide'></span>";
                self.getById("leftItem").appendChild(cat);
                //新建的主分类添加到弹框的下拉框中
                self.getById("subCat").innerHTML += "<option value='" + this.name + "'>" + this.name + "</option>";
                //显示及隐藏删除图标
                toggleTrashIcon(mainCat);

                if (addItem) {
                    //数据存储
                    self.addItemToArr(this.name, "name");
                }
                return cat;
            }

        };
        initData();

        function initData() {
            var arr_name = null;
            if (!localStorage.getItem("name")) {
                let arr = ["默认分类"];
                localStorage.setItem("name", JSON.stringify(arr));
                arr_name = arr;
            } else {
                var str = localStorage.getItem("name");
                arr_name = JSON.parse(str);
                // arr_name = eval('(' + str + ')');
            }
            self.clearData();
            for (let i = 0, len = arr_name.length; i < len; i++) {
                let cat = new Category(arr_name[i], parseInt(localStorage.getItem("unfinished" + arr_name[i]) || 0)).addCat(0);
                let sub = localStorage.getItem(arr_name[i]);
                if (sub) {
                    let sub_name = JSON.parse(sub);
                    for (let j = 0, len = sub_name.length; j < len; j++) {
                        new Category(sub_name[j], parseInt(localStorage.getItem("unfinished" + arr_name[i] + sub_name[j]) || 0)).addSub(cat, 0);
                    }
                }

            }
            //total unfinished
            self.getById("assignNum").innerHTML = (localStorage.getItem("totalUnfinished") || 0);
            //初始化中栏
            self.setFilter(0);
            var str = localStorage.getItem("date");
            if (str) {
                var dateArr = JSON.parse(str).sort();
                //建一个dateArr[i]日期的组，遍历eachDate，每个任务加入该组
                for (let i = 0, len = dateArr.length; i < len; i++) {
                    let indexArr = JSON.parse(localStorage.getItem(dateArr[i])),
                        dateGroup = self.createDateGroup(dateArr[i]);

                    for (let j = 0, len = indexArr.length; j < len; j++) {
                        let oneAssignment = JSON.parse(localStorage.getItem("Index" + indexArr[j])),
                            status = parseInt(localStorage.getItem(indexArr[j] + "status")) - 1,
                            assign = self.newAssignment2(status, oneAssignment.title, indexArr[j]);
                        dateGroup.appendChild(assign);
                        // self.addAssignmentDOM(self.getByClass("middleItem")[0], null, dateArr[i], assign);
                    }
                    self.getByClass("middleItem")[0].appendChild(dateGroup);

                }
            }
            //移除默认分类的删除图标
            self.getByClass("inMainCat")[0].remove();
        }
    },
    getById: function (id) {
        return document.getElementById(id);
    },
    getByClass: function (className, startPoint) {
        if (typeof startPoint !== "undefined") {
            return startPoint.getElementsByClassName(className);
        }
        return document.getElementsByClassName(className);
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

    },
    //新增任务（任务修改日期）
    addAssignment: function (startNode, newDate, changedNode) {
        var self = this,
            parentNode = self.getByClass("middleItem")[0],
            originParent = changedNode.parentNode;
        //任务新增在任务栏中
        for (var subDiv = startNode; subDiv; subDiv = subDiv.nextElementSibling) {
            if (subDiv.getAttribute("data-deadline") > newDate) { //新增任务日期比所有已存在日期都小
                var fragment = document.createElement("DIV");
                fragment.classList.add("dateGroup");
                fragment.setAttribute("data-deadline", newDate);
                fragment.innerHTML = "<div class ='dateBlock'>" + newDate + "</div>";
                parentNode.insertBefore(fragment, subDiv);
                fragment.insertBefore(changedNode, null);
                // added = true;
                break;
            } else if (subDiv.getAttribute("data-deadline") === newDate) { //已存在该日期分类
                subDiv.insertBefore(changedNode, null);
                // added = true;
                break;
            }

        }
        if (!subDiv) {
            //修改任务日期比所有已存在日期都大，添加到最末尾
            var fragment = document.createElement("DIV");
            fragment.classList.add("dateGroup");
            fragment.setAttribute("data-deadline", newDate);
            fragment.innerHTML = "<div class ='dateBlock'>" + newDate + "</div>";
            parentNode.insertBefore(fragment, subDiv);
            fragment.insertBefore(changedNode, null);
        }
        //如果原来日期下移出任务后无任务，则删除
        if (originParent.childElementCount < 2) {
            // parentNode.removeChild(originParent);
            //localStorage删除该日期，date删除该日期
            localStorage.removeItem(originParent.getAttribute("data-deadline"));
            self.removeItem(originParent.getAttribute("data-deadline"), "date");
            //移除该日期
            originParent.remove();
        }
        //更新存储日期
        self.addItemToArr(newDate, "date");
        self.addItemToArr(changedNode.getAttribute("data-assignIndex"), newDate);
    },

    addItemToArr: function (item, arrName) {
        var str = localStorage.getItem(arrName);
        if (str) {
            var arr = JSON.parse(str);
            // var arr = eval('(' + str + ')');
            if (!arr.includes(item)) {
                arr.push(item);
                localStorage.setItem(arrName, JSON.stringify(arr));
            }
        } else {
            var arr = [];
            arr.push(item);
            localStorage.setItem(arrName, JSON.stringify(arr));
        }
    },

    removeItem: function (item, arrName) {
        var str = localStorage.getItem(arrName);
        if (str) {
            var arr = JSON.parse(str),
                index = arr.indexOf(item);
            if (index != -1) {
                arr.splice(index, 1);
                if (arr.length) {
                    localStorage.setItem(arrName, JSON.stringify(arr));
                } else {
                    localStorage.removeItem(arrName);
                }
            }
        } else {
            alert("The arrName designated doesn't exist!");
        }
    },
    clearData: function () {
        var self = this;
        self.getById("subCat").innerHTML = "<option value='newCategory' selected>新建分类</option>";
        self.traverseClassNode(["category"], function (node) {
            node.remove();
        });
    },
    show: function (node) {
        node.classList.remove("hide");
    },
    hide: function (node) {
        node.classList.add("hide");
    },
    delete: function (node) {
        node.remove();
    },
    showAllAssignment: function () {
        var self = this;
        self.traverseClassNode(["dateGroup", "titleGroup"], function (node) {
            node.classList.remove("hide");
        });
    },
    //_delete(optional): delete node->1 otherwise don't designate this arg
    //点击分类：显示所有的任务，然后不符合选中条件的隐藏，删除分类：所有符合条件的要删除，所以这个筛选是反的
    filterAssignment: function (main, sub, status, func, _delete) {
        var self = this;
        self.traverseClassNode(["dateGroup"], function (node) {
            // let assignments = node.querySelectorAll("titleGroup"),
            let assignments = self.getByClass("titleGroup", node),
                assignmentNum = assignments.length,
                hideCount = 0;
            for (let i = 0; i < assignmentNum; i++) {
                let assignIndex = assignments[i].getAttribute("data-assignIndex"),
                    flag = 0;
                if (main) {
                    if (localStorage.getItem(assignIndex + "main") != main) {
                        flag = 1;
                    }
                    if (sub) {
                        if (localStorage.getItem(assignIndex + "sub") != sub) {
                            flag = 1;
                        }
                    }
                }
                // else {
                //     if (sub) {
                //         if (localStorage.getItem(assignIndex + "sub") != sub) {
                //             flag = 1;
                //         }
                //     }
                //     if (status) {
                //         if (localStorage.getItem(assignIndex + "status") != status) {
                //             flag = 1;
                //         }
                //     }

                // }
                if (status) {
                    if (localStorage.getItem(assignIndex + "status") != status) {
                        flag = 1;
                    }
                }
                if (_delete) {
                    if (!flag) {
                        self.removeItem(assignIndex, node.getAttribute("data-deadline"));
                        localStorage.removeItem(assignIndex + "main");
                        localStorage.removeItem(assignIndex + "status");
                        localStorage.removeItem(assignIndex + "sub");
                        localStorage.removeItem("Index" + assignIndex);

                        func(assignments[i]);
                        hideCount++;

                    }
                } else {
                    if (flag) {
                        func(assignments[i]);
                        hideCount++;

                    }
                }

            }

            if (assignmentNum === hideCount) {
                // self.hide(node);
                if (_delete) {
                    self.removeItem(node.getAttribute("data-deadline"), "date");
                }
                func(node);
            }

        });
    },
    //中栏筛选type=0所有=1未完成=2已完成
    setFilter: function (type) {
        var self = this,
            nodes = self.getByClass("filter"),
            len = nodes.length;
        for (let i = 0; i < len; i++) {
            nodes[i].classList.remove("filterBackground");
        }
        nodes[type].classList.add("filterBackground");
        //设置筛选类型
        self.assignmentType = type;
    },
    //operation -1 delete/1 add
    setUnfinished: function (operation, assignment) {
        var self = this,
            chosenCategory = self.assignment_to_category(assignment),
            chosenSubCategory = self.assignment_to_subCategory(assignment);

        //主分类未完成任务数加（减）一
        var numNode1 = self.getByClass("assignNum", chosenCategory)[0];
        numNode1.innerHTML = parseInt(numNode1.innerHTML) + operation;
        //存储localStorage
        localStorage.setItem("unfinished" + chosenCategory.getAttribute("data-category"), numNode1.innerHTML);

        //子分类未完成任务数加（减）一
        var numNode2 = self.getByClass("assignNum", chosenSubCategory)[0];
        numNode2.innerHTML = parseInt(numNode2.innerHTML) + operation;
        //存储localStorage
        localStorage.setItem("unfinished" + chosenCategory.getAttribute("data-category") + chosenSubCategory.getAttribute("data-string"), numNode2.innerHTML);

        //所有任务未完成任务数加（减）一
        var numNode3 = self.getById("assignNum");
        numNode3.innerHTML = parseInt(numNode3.innerHTML) + operation;
        //存储localStorage
        localStorage.setItem("totalUnfinished", numNode3.innerHTML);
    },
    //增加任务的DOM操作
    addAssignmentDOM: function (parentNode, subDiv, date, assignment) {
        var fragment = document.createElement("DIV");
        fragment.classList.add("dateGroup");
        fragment.setAttribute("data-deadline", date);
        fragment.innerHTML = "<div class ='dateBlock'>" + date + "</div>";
        fragment.appendChild(assignment);
        parentNode.appendChild(fragment, subDiv);
    },
    createDateGroup: function (date) {
        var fragment = document.createElement("DIV");
        fragment.classList.add("dateGroup");
        fragment.setAttribute("data-deadline", date);
        fragment.innerHTML = "<div class ='dateBlock'>" + date + "</div>";
        return fragment;
    },
    //eg. classList can be "class1 class2 class3 ...."
    //attributeList can be an object like:
    // {
    //     "attribute1":value,
    //     "attribute2":value,
    //     ......

    // }
    creatSpecificElement: function (tagName, classList, attributeList, innerHtml) {
        var element = document.createElement(tagName);
        element.className = classList;
        for (let key in attributeList) {
            element.setAttribute(key, attributeList[key]);
        }
        element.innerHTML = innerHtml;
        return element;
    },
    //新建一个任务
    newAssignment: function (status, title) {
        var self = this,
            assign = self.creatSpecificElement("DIV", "titleGroup", {
                    "data-status": status,
                    "data-assignIndex": self.assignIndex
                },
                "<span class='theTitle'>" + title + "</span>");
        localStorage.setItem("assignIndex", ++self.assignIndex);
        return assign;
    },
    newAssignment2: function (status, title, assignIndex) {
        //新建一个任务 用于初始化显示任务
        var self = this,
            assign = document.createElement("DIV");
        assign.classList.add("titleGroup");
        assign.setAttribute("data-status", status);
        assign.setAttribute("data-assignIndex", assignIndex);
        assign.innerHTML += "<span class='theTitle'>" + title + "</span>";
        if (status === 1) {
            assign.innerHTML +=
                "<div class='float_right'>" +
                "<span class='glyphicon glyphicon-ok'></span>" +
                "</div>";
        }
        return assign;
    },
    //新建任务
    addAssignmentBtn: function () {
        var self = this;
        if (self.chosenSubtitle) {
            self.getById("assignTitle").innerHTML = "<input type='text' class='inputTitle' placeholder='Please input a title' id='assTitle'>";
            // self.getById("content").innerHTML = "<input type='text' class='inputContent' placeholder='Please input some content' id='assContent'>";
            self.getById("content").innerHTML = "<textarea class='inputContent' placeholder='Please input some content' id='assContent'></textarea>";
            self.getById("inputDate").innerHTML = "<input type='date' name='deadline' id='deadline'>";

            //新建任务时，chosenAssign设为没有任务被选中
            self.chosenAssign = null;
            //右上按钮变为 取消编辑和完成编辑
            self.getByClass("titleIcon")[0].classList.toggle("hide");
            self.getByClass("titleIcon")[1].classList.toggle("hide");

            //focus on title input
            self.getById("assTitle").focus();
        } else {
            alert('Please choose a subCategory before adding an assignment');
        }
    },
    //任务点击响应：显示对应任务内容
    assignmentClick: function (target) {
        var self = this,
            index = parseInt(target.getAttribute("data-assignIndex")),
            obj = JSON.parse(localStorage.getItem("Index" + index));
        self.getById("assignTitle").innerHTML = obj.title;
        self.getById("inputDate").innerHTML = obj.date;
        self.getById("content").innerHTML = obj.content;
        self.chosenAssign = target;

    },
    assignment_to_category: function (obj) {
        var category = document.querySelectorAll(".category");
        for (let i = 0, len = category.length; i < len; i++) {
            if (category[i].getAttribute("data-category") === localStorage.getItem(obj.getAttribute("data-assignIndex") + "main")) {
                return category[i];
            }
        }
        return null;
    },
    assignment_to_subCategory: function (obj) {
        var self = this,
            chosenCategory = self.assignment_to_category(obj);
        if (chosenCategory) {
            let subCategory = chosenCategory.querySelectorAll(".subCat");
            for (let i = 0, len = subCategory.length; i < len; i++) {
                if (subCategory[i].getAttribute("data-string") === localStorage.getItem(obj.getAttribute("data-assignIndex") + "sub")) {
                    return subCategory[i];
                }
            }
            return null;
        }
    }

};
