import React, { Component } from 'react';

class MultiSelectMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            dropDownVisible: false
        };
        this.wrapperRef = React.createRef(); // 创建ref
    }

    componentDidMount() {
        // 在组件挂载后添加监听器
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        // 在组件卸载前移除监听器
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ dropDownVisible: false });
        }
    };

    handleOptionClick = (calKey) => {
        this.setState(prevState => {
            const selected = prevState.selected.includes(calKey)
                ? prevState.selected.filter(key => key !== calKey) // Remove if already selected
                : [...prevState.selected, calKey]; // Add if not selected
            return {
                selected,
                dropDownVisible: true // Keep dropdown open after selection
            };
        }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(this.state.selected);
            }
        });
    };

    toggleDropDown = () => {
        this.setState(prevState => ({ dropDownVisible: !prevState.dropDownVisible }));
    };

    render() {
        const { Calendars } = this.props;
        const { selected, dropDownVisible } = this.state;

        return (
            <span ref={this.wrapperRef}>
                <button onClick={this.toggleDropDown} className="dropdown-button">
                    {selected.length > 0
                        ? `${selected.map(key => Calendars[key]).join(', ')}`
                        : '請選擇曆法'}
                </button>
                {dropDownVisible && (
                    <ul className="dropdown-list">
                        {Object.entries(Calendars).map(([calKey, calDisplay]) => (
                            <li
                                key={calKey}
                                className={selected.includes(calKey) ? 'selected' : ''}
                                onClick={() => this.handleOptionClick(calKey)}
                            >
                                {calDisplay}
                            </li>
                        ))}
                    </ul>
                )}
            </span>
        );
    }
}

export default MultiSelectMenu;
