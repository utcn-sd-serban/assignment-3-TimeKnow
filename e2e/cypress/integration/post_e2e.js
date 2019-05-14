describe("The Post list", function() {

    beforeEach(function () {
        cy.request("http://localhost:8081/test/reseed")
            .its("status").should("be.equal", 200);
    });

    it("Dashboard Visibility Test", function() {
        cy.visit("/#/");

        cy.get('[data-cy="form_username"]').type("superuser");
        cy.get('[data-cy="form_password"]').type("superuser");
        cy.get('[data-cy="form_button"]').click('center');
        cy.wait(1000);
        cy.get('[data-cy="navbar_gotoDashboard"]').trigger('mouseover').click('center', { force: true, multiple: true});
        cy.wait(1000);
        cy.get('[data-cy="dashboard_card"]').should("have.length", 9);
    });

    it("Search Items", function() {
        cy.visit("/#/");

        cy.get('[data-cy="form_username"]').type("superuser");
        cy.get('[data-cy="form_password"]').type("superuser");
        cy.get('[data-cy="form_button"]').click('center');
        cy.wait(1000);
        cy.get('[data-cy="home_searchbar"]').type("test");
        cy.get('[data-cy="home_searchbutton"]').click();
        cy.wait(2000);
        cy.get('[data-cy="query_items"').should("have.length", 4);
    });

    it("Create question", function() {
        cy.visit("/#/");

        cy.get('[data-cy="form_username"]').type("superuser");
        cy.get('[data-cy="form_password"]').type("superuser");
        cy.get('[data-cy="form_button"]').click('center');
        cy.wait(1000);
        cy.get('[data-cy="navbar_gotoQuestions"]').click();
        cy.wait(2000);
        cy.get('[data-cy="form_question-title"]').type("test title");
        cy.get('[data-cy="form_question-body"]').type("test body");
        cy.get('[data-cy="form_question-tags"]').type("testtag");
        cy.get('[data-cy="form_post_createbutton"]').click('center');
        cy.wait(2000);
        cy.get('[data-cy="navbar_gotoHome"]').click('center');
        cy.wait(2000);
        cy.get('[data-cy="home_searchbar"]').type("test title");
        cy.get('[data-cy="home_searchbutton"]').click();
        cy.wait(2000);

        cy.get('[data-cy="query_items"').should("have.length", 1);
    });

    it("Create answer", function() {
        cy.visit("/#/");

        cy.get('[data-cy="form_username"]').type("superuser");
        cy.get('[data-cy="form_password"]').type("superuser");
        cy.get('[data-cy="form_button"]').click('center');
        cy.wait(1000);
        cy.get('[data-cy="navbar_gotoQuestions"]').click();
        cy.wait(2000);

        cy.get('[data-cy="form_question-title"]').type("Cypress");
        cy.get('[data-cy="form_question-body"]').type("Cypress");
        cy.get('[data-cy="form_question-tags"]').type("Cypress");
        cy.get('[data-cy="form_post_createbutton"]').click('center');
        cy.wait(2000);

        cy.get('[data-cy="home_searchbar"]').type("Cypress");
        cy.get('[data-cy="home_searchbutton"]').click();
        cy.wait(2000);

        cy.get('[data-cy="query_items_res"').first().click();
        cy.wait(2000);

        cy.get('[data-cy="post_responder_text"]').type("cypress answer");
        cy.get('[data-cy="post_responder_button"]').click();
        cy.wait(2000);
        cy.get('[data-cy="answers_container"]').should('have.length', 1);

    });

    it("Edit post test", function() {
        cy.visit("/#/");

        cy.get('[data-cy="form_username"]').type("superuser");
        cy.get('[data-cy="form_password"]').type("superuser");
        cy.get('[data-cy="form_button"]').click('center');
        cy.wait(1000);

        cy.get('[data-cy="navbar_gotoDashboard"]').trigger('mouseover').click('center', { force: true, multiple: true});
        cy.wait(1000);
        cy.get('[data-cy="dashboard_card"]').should("have.length", 9);

        cy.get('[data-cy="dashboard_card_edit_button"]').first().click();
        cy.wait(2000);

        cy.get('[data-cy="edit_post_body"]').type("modified question");
        cy.get('[data-cy="edit_post_submit_button"]').click();
        cy.wait(2000);

        cy.get('[data-cy="dashboard_card_body"]').first().should("contain", "modified question");
    });

    it("Delete post test", function() {
        cy.visit("/#/");

        cy.get('[data-cy="form_username"]').type("superuser");
        cy.get('[data-cy="form_password"]').type("superuser");
        cy.get('[data-cy="form_button"]').click('center');
        cy.wait(1000);
        cy.get('[data-cy="navbar_gotoDashboard"]').trigger('mouseover').click('center', { force: true, multiple: true});
        cy.wait(1000);
        cy.get('[data-cy="dashboard_card"]').should("have.length", 9);

        cy.get('[data-cy="dashboard_card_delete_button"]').first().click();
        cy.wait(1000);

        cy.get('[data-cy="dashboard_card"]').should("have.length", 8);


    });
});