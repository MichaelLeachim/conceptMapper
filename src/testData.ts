module testData {
        // Tree represents this way
    export var TestData = `
    @todo @urgent  Do paint; Rebuild tree; Restore database
    
    @urgent Must stay the same
    @todo Here we write todo-s
    
    @todo  @mindor Make transition to new React version Study d3.js Write prototype
    @mindor @later Move to production
    @todo @later  Get a life

    @later No way you can do anything
    
    @mindor @later @globals
      Blablabla blablabla
    @later @drogon
      hohohoh
    `
    
    // This must be translated into:
    export var TestDataResultingTree = `
    todo
      urgent
      mindor  
        later
        globals
      later
        drogon
    later
    `
    
    

}
