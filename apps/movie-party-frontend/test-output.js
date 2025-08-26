"use strict";

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var _testingLibraryReact = require("@testing-library/react");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

describe("Button Component", function () {
    test("renders button and handles click", function () {
        var handleClick = jest.fn();
        (0, _testingLibraryReact.render)(
            React.createElement(
                _index2["default"],
                { onClick: handleClick },
                "Click Me"
            )
        );

        var buttonElement = _testingLibraryReact.screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();

        _testingLibraryReact.fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
