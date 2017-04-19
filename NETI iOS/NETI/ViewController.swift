//
//  ViewController.swift
//  NETI
//
//  Created by Blake Gordon on 4/6/17.
//  Copyright © 2017 Blake Gordon. All rights reserved.
//

import UIKit
import Firebase
import FirebaseDatabase

class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    private var currentIndex = 0
    private var questions = TwentyQuestions.getQuestions()
    private var answers = TwentyQuestions.getAnswers()
    private var chosenAnswers = [String]()
    private var drugInfo = [String]()

    @IBOutlet var questionLabel: UILabel!
    @IBOutlet var descriptionLabel: UILabel!
    @IBOutlet var tableView: UITableView!
    @IBOutlet var backButton: UIButton!
    
    @IBAction func answerSelected(_ sender: Any) {
        currentIndex += 1
        
        if sender is UIButton {
            let selected = sender as! UIButton
            chosenAnswers.append((selected.titleLabel?.text)!.lowercased())
        }
        
        if currentIndex < questions.count {
            questionLabel.text = questions[currentIndex]
            self.tableView.reloadData()
        } else {
            // Display the selected drug
            tableView.isHidden = true
            descriptionLabel.isHidden = false
            backButton.isHidden = false
            self.questionLabel.text = "Loading..."
            self.descriptionLabel.text = ""
            
            let ref = FIRDatabase.database().reference()
            ref.child("color").observeSingleEvent(of: .value, with: { (snap) in
                for child in snap.children {
                    let color = child as! FIRDataSnapshot
                    let colorName = (color.value as! String).lowercased()
                    if colorName == self.chosenAnswers[0] {
                        self.drugInfo.append(color.key)
                    }
                }
                ref.child("consistency").observeSingleEvent(of: .value, with: { (snap) in
                    for child in snap.children {
                        let consistency = child as! FIRDataSnapshot
                        let name = (consistency.childSnapshot(forPath: "name").value as! String).lowercased()
                        if name == self.chosenAnswers[1] {
                            self.drugInfo.append(consistency.key)
                        }
                    }
                    ref.child("container").observeSingleEvent(of: .value, with: { (snap) in
                        for child in snap.children {
                            let container = child as! FIRDataSnapshot
                            let name = (container.childSnapshot(forPath: "name").value as! String).lowercased()
                            if name == self.chosenAnswers[2] {
                                self.drugInfo.append(container.key)
                            }
                        }
                        ref.child("drug").observeSingleEvent(of: .value, with: { (snap) in
                            for child in snap.children {
                                for drug in (child as! FIRDataSnapshot).childSnapshot(forPath: "appearances").children {
                                    let firDrug = drug as! FIRDataSnapshot
                                    var firDrugInfo = [String]()
                                    firDrugInfo.append(firDrug.childSnapshot(forPath: "color_id").value as! String)
                                    firDrugInfo.append(firDrug.childSnapshot(forPath: "consistency_id").value as! String)
                                    firDrugInfo.append(firDrug.childSnapshot(forPath: "container_id").value as! String)
                                    
                                    var sameDrug = true
                                    for i in 0...self.drugInfo.count-1 {
                                        if firDrugInfo[i] != self.drugInfo[i] {
                                            print(i)
                                            print("Bad at: \(firDrugInfo[i]) to \(self.drugInfo[i])")
                                            sameDrug = false
                                            break
                                        }
                                    }
                                    
                                    if sameDrug {
                                        let thisDrug = child as! FIRDataSnapshot
                                        
                                        self.questionLabel.text = thisDrug.childSnapshot(forPath: "name").value as? String
                                        self.descriptionLabel.text = thisDrug.childSnapshot(forPath: "description").value as? String
                                    }
                                }
                            }
                            
                            if self.questionLabel.text == "Loading..." {
                                self.questionLabel.text = "Drug Not Found"
                                self.descriptionLabel.text = "We could not find the drug you were looking for"
                            }
                        })
                    })
                })
            })
        }
    }
    
    @IBAction func backPressed(_ sender: Any) {
        chosenAnswers.removeAll()
        drugInfo.removeAll()
        currentIndex = 0
        
        tableView.isHidden = false
        descriptionLabel.isHidden = true
        backButton.isHidden = true
        
        questionLabel.text = questions[currentIndex]
        self.tableView.reloadData()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.delegate = self
        tableView.dataSource = self
        
        questionLabel.text = questions[currentIndex]
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return answers[currentIndex].count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "AnswerCell", for: indexPath) as! AnswerCell
        
        cell.answerButton.setTitle(answers[currentIndex][indexPath.row], for: .normal)
        cell.answerButton.layer.cornerRadius = 20
        cell.insideView.layer.cornerRadius = 5
        tableView.rowHeight = tableView.frame.size.height / CGFloat(answers[currentIndex].count)
        
        if tableView.rowHeight < 50 {
            tableView.isScrollEnabled = true
            tableView.rowHeight = 55
        } else {
            tableView.isScrollEnabled = false
        }
        
        return cell
    }


}

