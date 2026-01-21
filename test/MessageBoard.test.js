const { expect } = require("chai");

describe("MessageBoard", function () {
  it("Should absolutely work now", async function () {
    console.log("Testing after reinstall...");
    
    // 现在 ethers 应该可用
    const { ethers } = require("hardhat");
    console.log("Ethers available:", !!ethers);
    
    if (!ethers) {
      throw new Error("ethers is still undefined!");
    }
    
    // 获取签名者
    const signers = await ethers.getSigners();
    console.log("Number of signers:", signers.length);
    expect(signers.length).to.be.greaterThan(0);
    
    // 部署合约
    const MessageBoard = await ethers.getContractFactory("MessageBoard");
    const messageBoard = await MessageBoard.deploy();
    await messageBoard.deployed();
    
    console.log("Contract deployed:", messageBoard.address);
    expect(messageBoard.address).to.match(/^0x[a-fA-F0-9]{40}$/);
    
    // 测试功能
    await messageBoard.postMessage("Test");
    const count = await messageBoard.getMessageCount();
    console.log("Message count:", count.toString());
    expect(count.toNumber()).to.equal(1);
    
    console.log("✅ SUCCESS! Everything works!");
  });
});