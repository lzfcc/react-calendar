import React from "react";
import "./index.css";

export default class MenuSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      dropDownVisible: false
    };
    this.inputRef = null;
    this.containerRef = React.createRef(); // 创建一个ref来引用菜单容器
  }

  // 点击菜单外关闭菜单的逻辑
  handleOutsideClick = (event) => {
    if (
      this.containerRef.current &&
      !this.containerRef.current.contains(event.target)
    ) {
      this.setState({ dropDownVisible: false });
      // 当菜单关闭后，移除事件监听器
      document.removeEventListener('mousedown', this.handleOutsideClick);
    }
  };
  // 打开下拉菜单并添加事件监听器
  handleDropDown = () => {
    this.setState(prevState => ({
      dropDownVisible: !prevState.dropDownVisible
    }), () => {
      if (this.state.dropDownVisible) {
        // 当菜单打开时，监听点击事件
        document.addEventListener('mousedown', this.handleOutsideClick);
      }
    });
  };
  componentWillUnmount() {
    // 确保在组件卸载时移除事件监听器
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }
  render() {
    if (Object.keys(this.props.calMap).length <= 0) {
      return;
    }
    return (
      <div
        ref={this.containerRef} // 为菜单容器添加ref
        className={
          "chosen-container chosen-container-multi" +
          (this.state.dropDownVisible
            ? " chosen-with-drop chosen-container-active"
            : "")
        }
        title=""
      >
        <ul
          className="chosen-choices"
          onClick={this.handleDropDown}
        >
          {this.state.selected.map((calKey, index) => {
            return (
              <li className="search-choice">
                <span>{this.props.calMap[calKey]}</span>
                <div
                  className="search-choice-close"
                  data-option-array-index={index}
                  onClick={(event) => {
                    const selected = this.state.selected;
                    const deleteIndex = selected.indexOf(calKey);
                    selected.splice(deleteIndex, 1);
                    this.setState({ selected, dropDownVisible: false });
                    this.props.onSelect && this.props.onSelect(selected)
                  }}
                ></div>
              </li>
            );
          })}

          <li className="search-field">
            <input
              ref={(ref) => {
                this.inputRef = ref;
              }}
              className="chosen-search-input default"
              type="text"
              placeholder='請選擇曆法'
              autoComplete="off"
              // placeholder="What's in your mind?"
              onKeyDown={(event) => {
                if (event.code === 'Backspace') {
                  const selected = this.state.selected;
                  selected.pop();
                  this.setState({ selected, dropDownVisible: false });
                  this.props.onSelect && this.props.onSelect(selected)
                }
              }}
              value={''}
            />
          </li>
        </ul>
        {this.state.dropDownVisible && (
          <select
            data-placeholder="Type 'C' to view"
            multiple
            className="chosen-select-no-results"
            tabIndex="-1"
            onChange={(event) => {
              const value = event.target.value;
              const selected = this.state.selected;
              if (!selected.includes(value)) {
                selected.push(value);
              }
              this.setState({ selected, dropDownVisible: false });
              this.props.onSelect && this.props.onSelect(selected)
            }}
          >
            {Object.entries(this.props.calMap).map(([calKey, Name], index) => {
              const disabled = this.state.selected.includes(calKey);
              return <option disabled={disabled} value={calKey}>{Name}</option>;
            })}
          </select>
        )}
      </div>
    );
  }
}
