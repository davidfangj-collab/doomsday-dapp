// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MessageBoard {
    struct Message {
        string content;
        address sender;
        uint256 bidAmount;
        uint256 timestamp;
        bytes32 messageId;
    }

    Message[] public messages;
    uint256 public constant MAX_MESSAGES = 100;
    uint256 public constant DECAY_INTERVAL = 24 hours; // 衰减间隔：24小时
    uint256 public constant DECAY_RATE = 50; // 衰减率：50%

    uint256 public lastMessageTimestamp; // 最后一条留言的时间戳

    event MessageAdded(
        bytes32 messageId,
        string content,
        address sender,
        uint256 bidAmount,
        uint256 timestamp
    );

    /**
     * @dev 获取当前能进入前100名的最低竞价
     * @return 最低竞价金额，如果留言数量不足100，则返回0
     */
    function getMinimumBidForTop100() public view returns (uint256) {
        if (messages.length < MAX_MESSAGES) {
            // 如果留言数量不足100，任何大于0的竞价都能进入前100
            return 0;
        }
        
        // 获取第100条留言的原始竞价
        uint256 originalBid = messages[MAX_MESSAGES - 1].bidAmount;
        
        // 如果最后一条留言时间为0，说明还没有留言，返回0
        if (lastMessageTimestamp == 0) {
            return originalBid;
        }
        
        // 计算自最后一条留言以来经过的时间
        uint256 timeElapsed = block.timestamp - lastMessageTimestamp;
        
        // 如果经过的时间小于衰减间隔，返回原始竞价
        if (timeElapsed < DECAY_INTERVAL) {
            return originalBid;
        }
        
        // 计算经过了多少个衰减周期
        uint256 decayPeriods = timeElapsed / DECAY_INTERVAL;
        
        // 计算衰减后的竞价
        uint256 decayedBid = originalBid;
        for (uint256 i = 0; i < decayPeriods; i++) {
            // 每次衰减50%
            decayedBid = decayedBid * (100 - DECAY_RATE) / 100;
            
            // 防止衰减到0以下
            if (decayedBid == 0) {
                break;
            }
        }
        
        return decayedBid;
    }

    function addMessage(string calldata _content, bytes32 _messageId) external payable {
        require(msg.value > 0, "Bid amount must be greater than 0");
        
        // 检查当前竞价是否大于等于进入前100名的最低竞价
        uint256 minimumBid = getMinimumBidForTop100();
        require(msg.value > minimumBid, "Bid amount must be greater than the current minimum bid for top 100");
        
        Message memory newMessage = Message({
            content: _content,
            sender: msg.sender,
            bidAmount: msg.value,
            timestamp: block.timestamp,
            messageId: _messageId
        });

        // 插入排序，按竞价金额降序
        uint256 i = messages.length;
        messages.push(newMessage);
        
        while (i > 0 && messages[i - 1].bidAmount < newMessage.bidAmount) {
            messages[i] = messages[i - 1];
            i--;
        }
        
        if (i != messages.length - 1) {
            messages[i] = newMessage;
        }

        // 只保留前100条留言
        if (messages.length > MAX_MESSAGES) {
            messages.pop();
        }

        // 更新最后一条留言的时间戳
        lastMessageTimestamp = block.timestamp;

        emit MessageAdded(
            _messageId,
            _content,
            msg.sender,
            msg.value,
            block.timestamp
        );
    }

    function getMessages() external view returns (Message[] memory) {
        return messages;
    }

    /**
     * @dev 分页获取留言
     * @param _page 页码，从1开始
     * @param _pageSize 每页数量
     * @return 分页后的留言数组
     */
    function getMessagesPaginated(uint256 _page, uint256 _pageSize) external view returns (Message[] memory) {
        require(_page > 0, "Page must be greater than 0");
        require(_pageSize > 0, "Page size must be greater than 0");
        
        uint256 totalMessages = messages.length;
        uint256 startIndex = (_page - 1) * _pageSize;
        
        // 如果起始索引大于等于总留言数，返回空数组
        if (startIndex >= totalMessages) {
            return new Message[](0);
        }
        
        // 计算结束索引
        uint256 endIndex = startIndex + _pageSize;
        if (endIndex > totalMessages) {
            endIndex = totalMessages;
        }
        
        // 创建结果数组
        uint256 resultSize = endIndex - startIndex;
        Message[] memory result = new Message[](resultSize);
        
        // 填充结果数组
        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = messages[startIndex + i];
        }
        
        return result;
    }

    function getMessageCount() external view returns (uint256) {
        return messages.length;
    }

    // 允许合约接收ETH
    receive() external payable {}

    // 允许合约接收ETH（当调用不存在的函数时）
    fallback() external payable {}
}
