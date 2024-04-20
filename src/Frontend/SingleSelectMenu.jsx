import React, { Component } from 'react';

class SingleSelectMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            dropDownVisible: false
        };
    }

    handleOptionClick = (calKey) => {
        this.setState({ selected: calKey, dropDownVisible: false });
        if (this.props.onSelect) {
            this.props.onSelect(calKey);
        }
    };

    toggleDropDown = () => {
        this.setState(prevState => ({ dropDownVisible: !prevState.dropDownVisible }));
    };

    render() {
        const { Calendars } = this.props;
        const { selected, dropDownVisible } = this.state;

        return (
            <div className="select-menu">
                <button onClick={this.toggleDropDown} className="dropdown-button">
                    {selected ? Calendars[selected] : '請選擇'}
                </button>
                {dropDownVisible && (
                    <ul className="dropdown-list">
                        {Object.entries(Calendars).map(([calKey, calDisplay]) => (
                            <li
                                key={calKey}
                                className={selected === calKey ? 'selected' : ''}
                                onClick={() => this.handleOptionClick(calKey)}
                            >
                                {calDisplay}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default SingleSelectMenu;
