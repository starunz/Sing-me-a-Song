/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

describe("Posting new song and voting", () => {

  it("should correctly post a new song, vote and remove by low score", () => {
    const recommendation = {
      name: faker.name.findName(),
      youtubeLink: "https://www.youtube.com/watch?v=AepjLbcLrJE&list=RDMM&index=2&ab_channel=Scorpions",
    };
    cy.visit("http://localhost:3000/");

    cy.get("input[name=name]").type(recommendation.name);
    cy.get("input[name=link]").type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("button[type=button]").click();

    cy.wait("@postRecommendation");
    cy.contains(recommendation.name).should("be.visible");

    cy.get(".upVote").click();
    cy.get(".upVote").click();
    cy.get(".upVote").click();
    cy.get(".score").should("have.text", "3");

    cy.get(".downVote").click();
    cy.get(".downVote").click();
    cy.get(".score").should("have.text", "1");
  });
});

describe("Navigate to pages", () => {
  it("should visit the pages", () => {
    const name = faker.name.findName();

    cy.visit("http://localhost:3000/");

    cy.intercept("GET", "/recommendations/top/*").as("getTop");
    cy.contains("Top").click();

    cy.wait("@getTop");
    cy.url().should("equal", "http://localhost:3000/top");
    cy.contains(name).should("be.visible");

    cy.intercept("GET", "/recommendations/random").as("getRandom");
    cy.contains("Random").click();

    cy.wait("@getRandom");
    cy.url().should("equal", "http://localhost:3000/random");
    cy.contains(name).should("be.visible");
  });
});
