import React from 'react';

const NavBar = () => {
    return (
        <nav className="navbar bg-base-100 rounded-box shadow-base-300/20 shadow-sm">
            <div className="flex flex-1 items-center">
                <a
                    className="link text-base-content link-neutral text-xl font-bold no-underline"
                    href="#"
                >
                    FlyonUI
                </a>
            </div>
            <div className="navbar-end flex items-center gap-4">
                <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                    <button
                        id="dropdown-scrollable"
                        type="button"
                        className="dropdown-toggle btn btn-text btn-circle dropdown-open:bg-base-content/10 size-10"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        aria-label="Dropdown"
                    >
                        <div className="indicator">
                            <span className="indicator-item bg-error size-2 rounded-full"></span>
                            <span className="icon-[tabler--bell] text-base-content size-5.5"></span>
                        </div>
                    </button>
                    <div
                        className="dropdown-menu dropdown-open:opacity-100 hidden"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="dropdown-scrollable"
                    >
                        <div className="dropdown-header justify-center">
                            <h6 className="text-base-content text-base">Notifications</h6>
                        </div>
                        <div className="overflow-auto text-base-content/80 max-h-56 max-md:max-w-60">
                            {/* Notification items */}
                            <div className="dropdown-item">
                                <div className="avatar avatar-away-bottom">
                                    <div className="w-10 rounded-full">
                                        <img
                                            src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                                            alt="avatar 1"
                                        />
                                    </div>
                                </div>
                                <div className="w-60">
                                    <h6 className="truncate text-base">Charles Franklin</h6>
                                    <small className="text-base-content/50 truncate">
                                        Accepted your connection
                                    </small>
                                </div>
                            </div>
                            {/* Add more notification items here */}
                        </div>
                        <a href="#" className="dropdown-footer justify-center gap-1">
                            <span className="icon-[tabler--eye] size-4"></span>
                            View all
                        </a>
                    </div>
                </div>
                <div className="dropdown relative inline-flex [--auto-close:inside] [--offset:8] [--placement:bottom-end]">
                    <button
                        id="dropdown-avatar"
                        type="button"
                        className="dropdown-toggle flex items-center"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        aria-label="Dropdown"
                    >
                        <div className="avatar">
                            <div className="size-9.5 rounded-full">
                                <img
                                    src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                                    alt="avatar 1"
                                />
                            </div>
                        </div>
                    </button>
                    <ul
                        className="dropdown-menu dropdown-open:opacity-100 hidden min-w-60"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="dropdown-avatar"
                    >
                        <li className="dropdown-header gap-2">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        src="https://cdn.flyonui.com/fy-assets/avatar/avatar-1.png"
                                        alt="avatar"
                                    />
                                </div>
                            </div>
                            <div>
                                <h6 className="text-base-content text-base font-semibold">
                                    John Doe
                                </h6>
                                <small className="text-base-content/50">Admin</small>
                            </div>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--user]"></span>
                                My Profile
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--settings]"></span>
                                Settings
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--receipt-rupee]"></span>
                                Billing
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <span className="icon-[tabler--help-triangle]"></span>
                                FAQs
                            </a>
                        </li>
                        <li className="dropdown-footer gap-2">
                            <a className="btn btn-error btn-soft btn-block" href="#">
                                <span className="icon-[tabler--logout]"></span>
                                Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;