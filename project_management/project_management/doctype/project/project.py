# Copyright (c) 2025, Aman and Yashvi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from datetime import datetime, timedelta
class Project(Document):
    def before_save(self):
        if not self.start_date:
            self.start_date = frappe.utils.today()
        
        if not self.end_date and self.start_date:
            start_date = frappe.utils.getdate(self.start_date)
            self.end_date = frappe.utils.add_days(start_date, 180)
        