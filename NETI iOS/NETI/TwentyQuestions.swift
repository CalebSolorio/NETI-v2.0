//
//  20Questions.swift
//  NETI
//
//  Created by Blake Gordon on 4/6/17.
//  Copyright © 2017 Blake Gordon. All rights reserved.
//

import Foundation

class TwentyQuestions {
    private static let questions = [
        "What is the color of the drug?",
        "What is the consistency of the drug?",
        "What is the drug contained in?"
    ]
    private static let answers = [
        ["White", "Pink", "Blue", "Green", "Brown"],
        ["Powder", "Liquid", "Leafy", "Crystal", "Solid"],
        ["Bong", "Needle", "Pipe", "Capsule", "Tablet", "None"]
    ]
    
    static func getQuestions() -> [String] {
        return questions
    }
    
    static func getAnswers() -> [[String]] {
        return answers
    }
}
