export default class Navbar {
    constructor () {
        this._topNavbar = null;
        this._topNavbarBrand = null;
        this._topNavbarText = null;
        this._bottomNavbar = null;
        this._sideNavbar = null;
    }

    render() {
        this._topNavbar = $('<nav class="navbar navbar-dark bg-dark mb-3"></nav>').prependTo(document.body);
        this._topNavbarBrand = $('<div class="navbar-brand"></div>').appendTo(this._topNavbar);
        this._topNavbarText = $('<div class="navbar-text"></div>').appendTo(this._topNavbar);

        this._bottomNavbar = $('<div class="position-fixed b-3 r-3"></nav>').appendTo(document.body);

        this._sideNavbar = $(`<div class="flyout navbar-flyout" id="menu">
                <div class="navbar-nav">
                    <a class="nav-link" data-action="showHistory" data-dismiss="flyout">
                        <span class="icon icon-sm icon-history-sm"></span> History
                    </a>
                    <a class="nav-link" data-action="showRewards" data-dismiss="flyout">
                        <span class="icon icon-sm icon-star-sm"></span> Rewards
                    </a>
                    <a class="nav-link" data-action="showTutorial" data-dismiss="flyout">
                        <span class="icon icon-sm icon-help-sm"></span> Tutorial
                    </a>
                    <a class="nav-link position-absolute b-3 l-3" data-action="showOptions" data-dismiss="flyout">
                        <span class="icon icon-sm icon-settings-sm"></span> Options
                    </a>
                </div>
            </div>`).prependTo(document.body);
    }

    showGoals() {
        this._topNavbarBrand.html('<span class="icon icon-menu-sm" data-toggle="flyout" data-target="#menu"></span> Goals');
        this._bottomNavbar.html('<span class="icon icon-add" data-action="addGoal"></span>');
    }

    showHistory() {
        this._topNavbarBrand.html('<span class="icon icon-back-sm" data-action="showGoals"></span> History');
        this._bottomNavbar.empty();
    }

    showRewards() {
        this._topNavbarBrand.html('<span class="icon icon-back-sm" data-action="showGoals"></span> Rewards');
        this._bottomNavbar.html('<span class="icon icon-add" data-action="addReward"></span>');
    }

    updatePointsEarned(points) {
        this._topNavbarText.html(`${points} <span class="icon icon-sm icon-star-sm"></span>`);
    }
}

