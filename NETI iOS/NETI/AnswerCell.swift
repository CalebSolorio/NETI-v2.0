//
//  AnswerCell.swift
//  NETI
//
//  Created by Blake Gordon on 4/17/17.
//  Copyright © 2017 Blake Gordon. All rights reserved.
//

import UIKit

class AnswerCell: UITableViewCell {
    @IBOutlet var answerButton: UIButton!
    @IBOutlet var insideView: UIView!

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
