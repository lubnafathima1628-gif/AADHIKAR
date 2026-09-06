from datetime import datetime
from backend.app.database import engine, Base, SessionLocal
from backend.app.models.models import (
    User, Consent, AssetSource, AssetRecord, AssetMatch, Claim, ClaimEvent, AuditLog
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(AssetSource).count() > 0:
        print("Database already seeded with sources.")
        db.close()
        return

    print("Seeding ADHIKAAR database...")

    # 1. Sources
    sources_data = [
        {
            "code": "RBI_UDGAM",
            "name": "RBI UDGAM (Unclaimed Deposits Gateway)",
            "category": "bank",
            "authority": "Reserve Bank of India & Participating Scheduled Banks",
            "health_status": "healthy",
            "latency_ms": 110,
            "official_portal_url": "https://udgam.rbi.org.in"
        },
        {
            "code": "IRDAI_BIMA",
            "name": "IRDAI Bima Bharosa Unclaimed Policy Register",
            "category": "insurance",
            "authority": "Insurance Regulatory and Development Authority of India",
            "health_status": "healthy",
            "latency_ms": 140,
            "official_portal_url": "https://bimabharosa.irdai.gov.in"
        },
        {
            "code": "MCA_IEPF",
            "name": "IEPF Authority (Unclaimed Shares & Dividends)",
            "category": "investments",
            "authority": "Ministry of Corporate Affairs, Government of India",
            "health_status": "healthy",
            "latency_ms": 95,
            "official_portal_url": "https://www.iepf.gov.in"
        },
        {
            "code": "MOL_EPFO",
            "name": "EPFO Inoperative Member Account Portal",
            "category": "pf",
            "authority": "Employees' Provident Fund Organisation",
            "health_status": "delayed",
            "latency_ms": 280,
            "official_portal_url": "https://unifiedportal-mem.epfindia.gov.in"
        },
        {
            "code": "STATE_LAND",
            "name": "Unified State Revenue & Land Record Gateway",
            "category": "property",
            "authority": "State Revenue & Land Records Directorate",
            "health_status": "healthy",
            "latency_ms": 160,
            "official_portal_url": "https://landrecords.gov.in"
        },
        {
            "code": "GOV_DBT",
            "name": "Direct Benefit Transfer & Welfare Registry",
            "category": "benefits",
            "authority": "Cabinet Secretariat & Public Welfare Directorate",
            "health_status": "healthy",
            "latency_ms": 105,
            "official_portal_url": "https://dbtbharat.gov.in"
        }
    ]

    source_objs = {}
    for s in sources_data:
        src = AssetSource(**s)
        db.add(src)
        db.flush()
        source_objs[s["code"]] = src

    # 2. Asset Records (Carefully crafted realistic synthetic records for demonstration)
    records_data = [
        # Bank / Deposits (RBI UDGAM)
        {
            "source_id": source_objs["RBI_UDGAM"].id,
            "category": "bank",
            "institution": "State Bank of India (SBI)",
            "identifier_masked": "SB-XXXX-XXXX-4912",
            "holder_name": "Lubna Fatima",
            "holder_dob": "1988-04-12",
            "holder_phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "holder_address": "Flat 402, Green Glen Layout, Bellandur, Bengaluru, Karnataka - 560103",
            "approximate_value_range": "₹42,500 – ₹55,000",
            "status": "unclaimed",
            "last_activity_year": 2014,
            "claim_difficulty": "simple",
            "required_documents": ["Aadhaar Card", "PAN Card", "Original / Copy of Passbook", "Address Proof", "Unclaimed Deposit Claim Form"],
            "official_portal_url": "https://udgam.rbi.org.in",
            "source_notes": "Inoperative savings bank account transferred to RBI Depositor Education and Awareness (DEA) Fund after 10 years dormancy."
        },
        {
            "source_id": source_objs["RBI_UDGAM"].id,
            "category": "bank",
            "institution": "HDFC Bank Ltd",
            "identifier_masked": "FD-XXXX-XXXX-8821",
            "holder_name": "Lubna Fathima",
            "holder_dob": "1988-04-12",
            "holder_phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "holder_address": "84, 12th Main, Indiranagar, Bengaluru, Karnataka - 560038",
            "approximate_value_range": "₹1,20,000 – ₹1,45,000",
            "status": "unclaimed",
            "last_activity_year": 2013,
            "claim_difficulty": "simple",
            "required_documents": ["Aadhaar Card", "PAN Card", "Fixed Deposit Receipt (FDR) or Indemnity Bond", "Bank Branch Verification"],
            "official_portal_url": "https://udgam.rbi.org.in",
            "source_notes": "Matured Fixed Deposit unclaimed post maturity renewal window."
        },
        # Investments / IEPF
        {
            "source_id": source_objs["MCA_IEPF"].id,
            "category": "investments",
            "institution": "Tata Consultancy Services Ltd / IEPF Authority",
            "identifier_masked": "FOLIO-TCS-XXXX-7104",
            "holder_name": "Lubna Fathimah",
            "holder_dob": "1988-04-12",
            "holder_phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "holder_address": "Jayanagar 4th Block, Bengaluru, Karnataka - 560011",
            "approximate_value_range": "₹3,85,000 (110 Shares + 7 Yrs Dividends)",
            "status": "unclaimed",
            "last_activity_year": 2016,
            "claim_difficulty": "moderate",
            "required_documents": ["Form IEPF-5 Web Acknowledgement", "Indemnity Bond on Non-Judicial Stamp Paper", "Advance Stamp Receipt", "Demat Client Master List (CML)", "Aadhaar & PAN"],
            "official_portal_url": "https://www.iepf.gov.in",
            "source_notes": "Unclaimed shares and accumulated dividends transferred to Investor Education and Protection Fund under Section 124(6) of Companies Act."
        },
        # Insurance (IRDAI Bima Bharosa)
        {
            "source_id": source_objs["IRDAI_BIMA"].id,
            "category": "insurance",
            "institution": "Life Insurance Corporation of India (LIC)",
            "identifier_masked": "POL-XXXX-XXXX-9903",
            "holder_name": "Lubna Fatima",
            "holder_dob": "1988-04-12",
            "holder_phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "holder_address": "Koramangala 5th Block, Bengaluru, Karnataka - 560095",
            "approximate_value_range": "₹88,000 – ₹98,000",
            "status": "unclaimed",
            "last_activity_year": 2017,
            "claim_difficulty": "simple",
            "required_documents": ["Policy Document or Bond", "Discharge Voucher Form 3825", "Cancelled Bank Cheque", "Self-attested KYC"],
            "official_portal_url": "https://bimabharosa.irdai.gov.in",
            "source_notes": "Unclaimed policy maturity proceeds held in Senior Citizens Welfare Fund custody."
        },
        # EPF / PF
        {
            "source_id": source_objs["MOL_EPFO"].id,
            "category": "pf",
            "institution": "Employees' Provident Fund Organisation (Karnataka Regional Office)",
            "identifier_masked": "KN/BNG/XXXX-4819/000",
            "holder_name": "L. Fathima",
            "holder_dob": "1988-04-12",
            "holder_phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "holder_address": "Tech Park Area, Whitefield, Bengaluru, Karnataka - 560066",
            "approximate_value_range": "₹64,200 – ₹72,000",
            "status": "unclaimed",
            "last_activity_year": 2015,
            "claim_difficulty": "moderate",
            "required_documents": ["EPFO Form 19 (Final PF Settlement)", "Joint Declaration Form signed by previous employer or Gazetted Officer", "Bank Passbook Copy with IFSC", "Aadhaar linked UAN"],
            "official_portal_url": "https://unifiedportal-mem.epfindia.gov.in",
            "source_notes": "Inoperative PF account inactive for over 36 consecutive months post previous employment exit."
        },
        # Property / Land
        {
            "source_id": source_objs["STATE_LAND"].id,
            "category": "property",
            "institution": "Department of Stamps & Registration (Bhoomi Records)",
            "identifier_masked": "SURVEY-KN-BLR-XXXX-102",
            "holder_name": "Lubna Fathima",
            "holder_dob": "1988-04-12",
            "holder_phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "holder_address": "Sy No 44/2, Devanahalli Taluk, Bengaluru Rural, Karnataka",
            "approximate_value_range": "Ancestral Land Plot (Verified Title Record)",
            "status": "unclaimed",
            "last_activity_year": 2011,
            "claim_difficulty": "complex",
            "required_documents": ["Encumbrance Certificate (EC Form 15)", "Certified Copy of Sale Deed / Partition Deed", "Khata Certificate & Mutation Register Extract", "Family Tree / Genealogy Affidavit"],
            "official_portal_url": "https://landrecords.gov.in",
            "source_notes": "Unmutated title register with pending Khata transfer application."
        },
        # Government Benefit
        {
            "source_id": source_objs["GOV_DBT"].id,
            "category": "benefits",
            "institution": "Direct Benefit Transfer (DBT) Welfare Fund",
            "identifier_masked": "DBT-SCHEME-XXXX-552",
            "holder_name": "Lubna Fatima",
            "holder_dob": "1988-04-12",
            "holder_phone_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "holder_address": "Bengaluru Urban, Karnataka",
            "approximate_value_range": "₹15,000",
            "status": "unclaimed",
            "last_activity_year": 2019,
            "claim_difficulty": "simple",
            "required_documents": ["Aadhaar Linked Bank Account Form", "Scheme Enrolment Slip"],
            "official_portal_url": "https://dbtbharat.gov.in",
            "source_notes": "Failed DBT credit due to bank account merger / dormant mandate."
        }
    ]

    for rec in records_data:
        r = AssetRecord(**rec)
        db.add(r)

    db.commit()
    print("Database seeded successfully with institutional records.")
    db.close()

if __name__ == "__main__":
    seed_database()
